package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.CartItem;
import eathappy.com.fooddel.entity.Order;
import eathappy.com.fooddel.entity.OrderItem;
import eathappy.com.fooddel.entity.User;
import eathappy.com.fooddel.repository.CartRepository;
import eathappy.com.fooddel.repository.OrderRepository;
import eathappy.com.fooddel.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
    private final EmailService emailService;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
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
}
