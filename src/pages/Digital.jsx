import Products from '@/components/products/Products';
import PropTypes from 'prop-types';

const Digital = ({ addToCart }) => {
  return <Products category="Digital" addToCart={addToCart} />;
};

Digital.propTypes = {
  addToCart: PropTypes.func.isRequired,
};

export default Digital; 