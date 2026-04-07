import { render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock("./services/api", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));

const Home = require("./pages/Home").default;

test("renders the home page hero content", async () => {
  render(<Home />);

  expect(await screen.findByText(/hungry\?/i)).toBeInTheDocument();
  expect(screen.getByText(/what are you craving\?/i)).toBeInTheDocument();
});
