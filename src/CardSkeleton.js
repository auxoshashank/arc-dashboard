import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSkeleton = ({ amount }) => {
  const loadCards = Array(amount).fill(1);
  return loadCards.map((card, i) => (
    <div className="card-skeleton" key={i}>
      <div>
        <Skeleton width={100} />
      </div>
      <div>
        <Skeleton count={5} />
      </div>
    </div>
  ));
};

export default CardSkeleton;