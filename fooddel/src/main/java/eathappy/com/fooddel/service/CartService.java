package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.CartItem;
import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.User;
import eathappy.com.fooddel.repository.CartRepository;
import eathappy.com.fooddel.repository.MenuRepository;
import eathappy.com.fooddel.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final MenuRepository menuRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, MenuRepository menuRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartItem addToCart(String email, Long menuItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        User user = getUserByEmail(email);
        MenuItem menuItem = menuRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));

        CartItem cartItem = cartRepository.findByUserIdAndMenuItemId(user.getId(), menuItemId)
                .orElseGet(CartItem::new);

        cartItem.setUser(user);
        cartItem.setMenuItem(menuItem);
        cartItem.setQuantity((cartItem.getQuantity() == null ? 0 : cartItem.getQuantity()) + quantity);
        return cartRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCart(String email) {
        User user = getUserByEmail(email);
        return cartRepository.findByUserId(user.getId());
    }

    @Transactional
    public String removeFromCart(String email, Long cartItemId) {
        User user = getUserByEmail(email);
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can remove only your own cart items");
        }

        cartRepository.delete(cartItem);
        return "Cart item removed successfully";
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
