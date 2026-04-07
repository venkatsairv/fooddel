package eathappy.com.fooddel.controller;

import eathappy.com.fooddel.entity.CartItem;
import eathappy.com.fooddel.service.CartService;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart(Principal principal) {
        return cartService.getCart(principal.getName());
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartRequest request, Principal principal) {
        return cartService.addToCart(principal.getName(), request.menuItemId(), request.quantity());
    }

    @PatchMapping("/quantity/{id}")
    public CartItem updateCartQuantity(@PathVariable Long id, @RequestBody UpdateCartRequest request, Principal principal) {
        return cartService.updateCartQuantity(principal.getName(), id, request.quantity());
    }

    @PatchMapping("/decrease/{id}")
    public String decreaseCartItem(@PathVariable Long id, Principal principal) {
        return cartService.decreaseCartItem(principal.getName(), id);
    }

    @DeleteMapping("/remove/{id}")
    public String removeFromCart(@PathVariable Long id, Principal principal) {
        return cartService.removeFromCart(principal.getName(), id);
    }

    public record CartRequest(Long menuItemId, Integer quantity) {
    }

    public record UpdateCartRequest(Integer quantity) {
    }
}
