# shopify-graphql-product-fetcher

A script to fetch and list product variants from a Shopify store using GraphQL, based on input product names.

## Setup Instructions

1. **Copy Environment Variables:**

   - Duplicate `.env.example` and rename it to `.env`.
   - Replace placeholder values with your actual Shopify admin token, store URL, and API version.

   Example `.env` file:

   ```dotenv
   # Shopify GraphQL Product Fetcher Environment Variables

   # Replace placeholders with your actual Shopify store URL, admin token, and API version

   STORE_URL=https://your-shopify-store-url.myshopify.com
   ADMIN_TOKEN=your_shopify_admin_token_here
   API_VERSION=yyyy-mm

   ```

2. **Install Dependencies:**

   ```bash
   npm install

   ```

3. **Run the Script:**
   To fetch and display Shopify products based on a specific product name, use the following command:

   ```bash
   # Replace <product_name> with the name of the product you want to search for.
   node app.js --name <product_name>
   ```
