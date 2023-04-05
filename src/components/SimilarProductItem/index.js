// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {eachObject} = props
  const {brand, imageUrl, price, rating, title} = eachObject

  return (
    <li className="list-item-similar-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="product-similar-image"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="product-similar-item">
        <p className="price-similar">Rs {price}/-</p>
        <div className="rating-similar-container">
          <p className="rating-similar">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-similar"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
