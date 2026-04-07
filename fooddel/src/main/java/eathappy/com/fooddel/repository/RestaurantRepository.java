package eathappy.com.fooddel.repository;

import eathappy.com.fooddel.entity.Restaurant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findAllByOrderByNameAsc();

    List<Restaurant> findByLocationIgnoreCaseOrderByNameAsc(String location);

    List<Restaurant> findAllByOrderByLocationAscNameAsc();
}
