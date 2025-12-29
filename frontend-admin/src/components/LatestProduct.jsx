import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ProductCard from "./ProductCard";
import api from "../api/axios";

const LatestProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await api.get("/products/latest");

      return res.data.data;
    },
  });

  return (
    <>
      <Typography variant="h4" className="text-center py-5">
        Latest Products
      </Typography>

      <Grid container spacing={2}>
        {isLoading ? (
          <>
            <Grid size={3}>
              <Skeleton height="300" width="200px" />
            </Grid>
            <Grid size={3}>
              <Skeleton height="300" width="200px" />
            </Grid>
            <Grid size={3}>
              <Skeleton height="300" width="200px" />
            </Grid>
            <Grid size={3}>
              <Skeleton height="300" width="200px" />
            </Grid>
          </>
        ) : (
          <>
            {data.map((product) => {
              return (
                <Grid key={product._id} size={3}>
                  <ProductCard product={product} />
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </>
  );
};

export default LatestProducts;
