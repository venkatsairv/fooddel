package eathappy.com.fooddel;

import eathappy.com.fooddel.entity.MenuItem;
import eathappy.com.fooddel.entity.Restaurant;
import eathappy.com.fooddel.entity.RestaurantOwner;
import eathappy.com.fooddel.repository.MenuRepository;
import eathappy.com.fooddel.repository.RestaurantOwnerRepository;
import eathappy.com.fooddel.repository.RestaurantRepository;
import java.math.BigDecimal;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FooddelApplication {

	public static void main(String[] args) {
		SpringApplication.run(FooddelApplication.class, args);
	}

	@Bean
	CommandLineRunner seedData(
			RestaurantRepository restaurantRepository,
			MenuRepository menuRepository,
			RestaurantOwnerRepository restaurantOwnerRepository,
			PasswordEncoder passwordEncoder
	) {
		return args -> {
			Restaurant spiceHub;
			Restaurant pizzaPoint;
			Restaurant greenBowl;

			if (restaurantRepository.count() == 0) {
				spiceHub = new Restaurant();
				spiceHub.setName("Spice Hub");
				spiceHub.setLocation("Hyderabad");
				spiceHub = restaurantRepository.save(spiceHub);

				pizzaPoint = new Restaurant();
				pizzaPoint.setName("Pizza Point");
				pizzaPoint.setLocation("Bengaluru");
				pizzaPoint = restaurantRepository.save(pizzaPoint);

				greenBowl = new Restaurant();
				greenBowl.setName("Green Bowl");
				greenBowl.setLocation("Chennai");
				greenBowl = restaurantRepository.save(greenBowl);
			} else {
				spiceHub = restaurantRepository.findByLocationIgnoreCaseOrderByNameAsc("Hyderabad").stream().findFirst().orElse(null);
				pizzaPoint = restaurantRepository.findByLocationIgnoreCaseOrderByNameAsc("Bengaluru").stream().findFirst().orElse(null);
				greenBowl = restaurantRepository.findByLocationIgnoreCaseOrderByNameAsc("Chennai").stream().findFirst().orElse(null);
			}

			if (menuRepository.count() == 0) {
				menuRepository.save(createMenuItem("Chicken Biryani", "249.00", true, spiceHub));
				menuRepository.save(createMenuItem("Paneer Curry", "199.00", true, spiceHub));
				menuRepository.save(createMenuItem("Tandoori Roti", "25.00", true, spiceHub));

				menuRepository.save(createMenuItem("Margherita Pizza", "299.00", true, pizzaPoint));
				menuRepository.save(createMenuItem("Veg Supreme Pizza", "399.00", true, pizzaPoint));
				menuRepository.save(createMenuItem("Garlic Bread", "149.00", false, pizzaPoint));

				menuRepository.save(createMenuItem("Caesar Salad", "179.00", true, greenBowl));
				menuRepository.save(createMenuItem("Veg Rice Bowl", "219.00", true, greenBowl));
				menuRepository.save(createMenuItem("Fresh Lime Soda", "79.00", true, greenBowl));
			}

			if (restaurantOwnerRepository.count() == 0) {
				restaurantOwnerRepository.save(createOwner("Rahul", "owner.spice@example.com", "owner123", spiceHub, passwordEncoder));
				restaurantOwnerRepository.save(createOwner("Anita", "owner.pizza@example.com", "owner123", pizzaPoint, passwordEncoder));
				restaurantOwnerRepository.save(createOwner("Kiran", "owner.green@example.com", "owner123", greenBowl, passwordEncoder));
			}
		};
	}

	private MenuItem createMenuItem(String name, String price, boolean available, Restaurant restaurant) {
		MenuItem menuItem = new MenuItem();
		menuItem.setName(name);
		menuItem.setPrice(new BigDecimal(price));
		menuItem.setAvailable(available);
		menuItem.setRestaurant(restaurant);
		return menuItem;
	}

	private RestaurantOwner createOwner(
			String name,
			String email,
			String password,
			Restaurant restaurant,
			PasswordEncoder passwordEncoder
	) {
		RestaurantOwner owner = new RestaurantOwner();
		owner.setName(name);
		owner.setEmail(email);
		owner.setPassword(passwordEncoder.encode(password));
		owner.setRestaurant(restaurant);
		return owner;
	}

}
