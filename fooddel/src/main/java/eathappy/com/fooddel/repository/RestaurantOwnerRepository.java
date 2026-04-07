package eathappy.com.fooddel.repository;

import eathappy.com.fooddel.entity.RestaurantOwner;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantOwnerRepository extends JpaRepository<RestaurantOwner, Long> {

    Optional<RestaurantOwner> findByEmail(String email);

    Optional<RestaurantOwner> findByRestaurantId(Long restaurantId);

    boolean existsByEmail(String email);

    boolean existsByRestaurantId(Long restaurantId);
}
