package eathappy.com.fooddel.service;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.Restaurant;
import eathappy.com.fooddel.repository.MenuRepository;
import eathappy.com.fooddel.repository.RestaurantRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuRepository menuRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
    }

    public Map<String, Object> getHomePageData() {
        return Map.of(
                "message", "Welcome to Food Delivery Backend",
                "publicApis", List.of(
                        "GET /",
                        "GET /locations",
                        "POST /auth/register",
                        "POST /auth/login",
                        "GET /restaurants",
                        "GET /restaurants?location={location}",
                        "GET /menu/{restaurantId}"
                ),
                "protectedApis", List.of(
                        "GET /cart",
                        "POST /cart/add",
                        "DELETE /cart/remove/{id}",
                        "POST /order/place",
                        "POST /order/cancel/{id}",
                        "GET /orders"
                )
        );
    }

    public List<String> getAllLocations() {
        return restaurantRepository.findAllByOrderByLocationAscNameAsc()
                .stream()
                .map(Restaurant::getLocation)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAllByOrderByNameAsc();
    }

    public List<Restaurant> getRestaurantsByLocation(String location) {
        if (location == null || location.isBlank()) {
            return getAllRestaurants();
        }
        return restaurantRepository.findByLocationIgnoreCaseOrderByNameAsc(location.trim());
    }

    public List<MenuItem> getMenuByRestaurant(Long restaurantId) {
        return menuRepository.findByRestaurantIdOrderByNameAsc(restaurantId);
    }
}
