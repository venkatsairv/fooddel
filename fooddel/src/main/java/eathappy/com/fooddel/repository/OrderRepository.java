package eathappy.com.fooddel.repository;

import eathappy.com.fooddel.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.menuItem", "items.menuItem.restaurant", "user"})
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
