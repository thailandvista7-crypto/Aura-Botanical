import { useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { ShoppingBag } from "lucide-react";

export default function ProductsPage() {
  const [page] = useState(1);

  const { data, isLoading } = trpc.product.list.useQuery({
    page,
    limit: 12,
  });

  const products = data?.items ?? [];

  return (
    <div style={{ padding: 40 }}>
      <h1>Products</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {products.map((product: any) => (
            <div key={product.id}>
              <Link to={/products/${product.id}}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
              </Link>

              <h3>{product.name}</h3>
              <p>${(product.price / 100).toFixed(2)}</p>

              <button>
                <ShoppingBag size={14} /> Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
