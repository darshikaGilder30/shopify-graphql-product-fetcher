require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");

// Read environment variables
const adminToken = process.env.ADMIN_TOKEN;
const apiUrl = `${process.env.STORE_URL}/admin/api/${process.env.API_VERSION}/graphql.json`;

// GraphQL query to search products by name and list variants
const productSearchQuery = `
  query($name: String!) {
    products(first: 10, query: $name) {
      edges {
        node {
          title
          variants(first: 10) {
            edges {
              node {
                title
                price
              }
            }
          }
        }
      }
    }
  }
`;

// Function to fetch products from Shopify using GraphQL API
const fetchProducts = async (productName) => {
  try {
    // Make a POST request to Shopify's GraphQL endpoint
    const response = await axios.post(
      apiUrl, // Shopify's GraphQL endpoint URL
      {
        query: productSearchQuery, // GraphQL query to search for products by name
        variables: { name: productName }, // Variables object containing the product name
      },
      {
        headers: {
          "Content-Type": "application/json", // Request content type
          "X-Shopify-Access-Token": adminToken, // Shopify admin access token for authentication
        },
      }
    );

    // Return the array of product edges from the GraphQL response data
    return response.data.data.products.edges;
  } catch (error) {
    // Handle and log errors that occur during the API request
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error to propagate it to the calling function
  }
};

// Function to execute the script
const fetchAndDisplayProducts = async () => {
  // Remove the first two elements (node and script path) from process.argv
  const args = process.argv.slice(2);

  // Find the index of "--name" argument
  const nameArgIndex = args.indexOf("--name");

  // Check if "--name" argument is missing or doesn't have a value
  if (nameArgIndex === -1 || !args[nameArgIndex + 1]) {
    console.error("Please provide a product name using --name");
    process.exit(1); // Exit the script with an error status (1)
  }

  const productName = args[nameArgIndex + 1]; // Extract the product name from the arguments
  try {
    // Attempt to fetch products from Shopify based on the provided product name
    const products = await fetchProducts(productName);

    // Check if products were found
    if (products.length > 0) {
      // Flatten and map product variants to extract relevant details
      const variants = products.flatMap((product) =>
        product.node.variants.edges.map((variant) => ({
          productTitle: product.node.title, // Product title
          variantTitle: variant.node.title, // Variant title
          price: parseFloat(variant.node.price), // Variant price (converted to float)
        }))
      );

      // Sort variants by product title in ASC order
      variants.sort((a, b) => a.productTitle.localeCompare(b.productTitle));

      // Display each variant's details
      variants.forEach((variant) => {
        console.log(
          `${variant.productTitle} - ${variant.variantTitle} - price $${variant.price}`
        );
      });
    } else {
      // If no products were found matching the provided name
      console.log("No products found matching the provided name.");
    }
  } catch (error) {
    // Handle errors that occur during product fetching
    console.error("Error fetching products:", error);
  }
};

// Execute the main function to start fetching and displaying products
fetchAndDisplayProducts();
