import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import api from "../api/axios";

const FeaturedProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await api.get("/products/featured");

      return res.data.data;
    },
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      <Typography variant="h4" className="text-center py-5">
        Featured Products
      </Typography>

      {isLoading ? (
        <Slider {...settings}>
          <Skeleton height={300} width={200} />
          <Skeleton height={300} width={200} />
          <Skeleton height={300} width={200} />
          <Skeleton height={300} width={200} />
        </Slider>
      ) : (
        <Slider {...settings}>
          {data.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      )}
    </>
  );
};

export default FeaturedProducts;
