package eathappy.com.fooddel.repository;

import eathappy.com.fooddel.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    @EntityGraph(attributePaths = {"menuItem", "menuItem.restaurant"})
    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndMenuItemId(Long userId, Long menuItemId);
}
