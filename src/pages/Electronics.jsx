import Products from '@/components/products/Products';
import PropTypes from 'prop-types';

const Electronics = ({ addToCart }) => {
  return <Products category="Electronics" addToCart={addToCart} />;
};

Electronics.propTypes = {
  addToCart: PropTypes.func.isRequired,
};

export default Electronics; 