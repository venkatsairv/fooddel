package eathappy.com.fooddel;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.Restaurant;
import eathappy.com.fooddel.repository.MenuRepository;
import eathappy.com.fooddel.repository.RestaurantRepository;
import java.math.BigDecimal;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FooddelApplication {

	public static void main(String[] args) {
		SpringApplication.run(FooddelApplication.class, args);
	}

	@Bean
	CommandLineRunner seedData(RestaurantRepository restaurantRepository, MenuRepository menuRepository) {
		return args -> {
			if (restaurantRepository.count() > 0 || menuRepository.count() > 0) {
				return;
			}

			Restaurant spiceHub = new Restaurant();
			spiceHub.setName("Spice Hub");
			spiceHub.setLocation("Hyderabad");
			spiceHub = restaurantRepository.save(spiceHub);

			Restaurant pizzaPoint = new Restaurant();
			pizzaPoint.setName("Pizza Point");
			pizzaPoint.setLocation("Bengaluru");
			pizzaPoint = restaurantRepository.save(pizzaPoint);

			Restaurant greenBowl = new Restaurant();
			greenBowl.setName("Green Bowl");
			greenBowl.setLocation("Chennai");
			greenBowl = restaurantRepository.save(greenBowl);

			menuRepository.save(createMenuItem("Chicken Biryani", "249.00", spiceHub));
			menuRepository.save(createMenuItem("Paneer Curry", "199.00", spiceHub));
			menuRepository.save(createMenuItem("Tandoori Roti", "25.00", spiceHub));

			menuRepository.save(createMenuItem("Margherita Pizza", "299.00", pizzaPoint));
			menuRepository.save(createMenuItem("Veg Supreme Pizza", "399.00", pizzaPoint));
			menuRepository.save(createMenuItem("Garlic Bread", "149.00", pizzaPoint));

			menuRepository.save(createMenuItem("Caesar Salad", "179.00", greenBowl));
			menuRepository.save(createMenuItem("Veg Rice Bowl", "219.00", greenBowl));
			menuRepository.save(createMenuItem("Fresh Lime Soda", "79.00", greenBowl));
		};
	}

	private MenuItem createMenuItem(String name, String price, Restaurant restaurant) {
		MenuItem menuItem = new MenuItem();
		menuItem.setName(name);
		menuItem.setPrice(new BigDecimal(price));
		menuItem.setRestaurant(restaurant);
		return menuItem;
	}

}
