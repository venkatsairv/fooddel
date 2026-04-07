package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.CartItem;
import eathappy.com.fooddel.entity.Order;
import eathappy.com.fooddel.entity.OrderItem;
import eathappy.com.fooddel.entity.RestaurantOwner;
import eathappy.com.fooddel.entity.User;
import eathappy.com.fooddel.repository.CartRepository;
import eathappy.com.fooddel.repository.OrderRepository;
import eathappy.com.fooddel.repository.RestaurantOwnerRepository;
import eathappy.com.fooddel.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final RestaurantOwnerRepository restaurantOwnerRepository;
    private final EmailService emailService;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository,
            RestaurantOwnerRepository restaurantOwnerRepository,
            EmailService emailService
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.restaurantOwnerRepository = restaurantOwnerRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Order placeOrder(String email) {
        User user = getUserByEmail(email);
        List<CartItem> cartItems = cartRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            if (Boolean.FALSE.equals(cartItem.getMenuItem().getAvailable())) {
                throw new IllegalStateException(cartItem.getMenuItem().getName() + " is currently unavailable");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItems.add(orderItem);

            BigDecimal itemPrice = cartItem.getMenuItem().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(itemPrice);
        }

        order.setItems(orderItems);
        order.setTotalPrice(total);

        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteAll(cartItems);
        emailService.sendOrderEmail(user.getEmail(), savedOrder);
        notifyOwnersAboutPlacedOrder(savedOrder);

        logger.info("Order placed by user: {} with order id {}", user.getId(), savedOrder.getId());
        return savedOrder;
    }

    @Transactional
    public Order cancelOrder(String email, Long orderId) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can cancel only your own orders");
        }
        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Order is already cancelled");
        }

        order.setStatus("CANCELLED");
        notifyOwnersAboutCancelledOrder(order);
        logger.info("Order cancelled by user: {} with order id {}", user.getId(), order.getId());
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrders(String email) {
        User user = getUserByEmail(email);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void notifyOwnersAboutPlacedOrder(Order order) {
        for (RestaurantOwner owner : getOwnersFromOrder(order)) {
            emailService.sendOwnerOrderPlacedEmail(owner.getEmail(), order, owner.getRestaurant().getName());
        }
    }

    private void notifyOwnersAboutCancelledOrder(Order order) {
        for (RestaurantOwner owner : getOwnersFromOrder(order)) {
            emailService.sendOwnerOrderCancelledEmail(owner.getEmail(), order, owner.getRestaurant().getName());
        }
    }

    private Set<RestaurantOwner> getOwnersFromOrder(Order order) {
        Set<RestaurantOwner> owners = new LinkedHashSet<>();
        for (OrderItem item : order.getItems()) {
            restaurantOwnerRepository.findByRestaurantId(item.getMenuItem().getRestaurant().getId())
                    .ifPresent(owners::add);
        }
        return owners;
    }
}
