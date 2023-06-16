import Navbar from "../components/Navbar";
import VillaCard from "../components/VillaCard";

const Marketplace = () => {
  return (
    <div className="display flex justify-center items-center">
      <Navbar lightText={true} />
      <VillaCard />
    </div>
  );
};

export default Marketplace;
