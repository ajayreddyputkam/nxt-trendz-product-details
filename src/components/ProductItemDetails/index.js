// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const responseStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProducts: [],
    statusResponse: responseStatus.initial,
    errMsg: '',
    itemsCount: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({statusResponse: responseStatus.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const formattingSimilarProducts = data.similar_products.map(
        eachObject => ({
          availability: eachObject.availability,
          brand: eachObject.brand,
          description: eachObject.description,
          id: eachObject.id,
          imageUrl: eachObject.image_url,
          price: eachObject.price,
          rating: eachObject.rating,
          style: eachObject.style,
          title: eachObject.title,
          totalReviews: eachObject.total_reviews,
        }),
      )

      this.setState({
        productItemDetails: formattedData,
        similarProducts: formattingSimilarProducts,
        statusResponse: responseStatus.success,
      })
    } else {
      const data = await response.json()
      this.setState({
        statusResponse: responseStatus.failure,
        errMsg: data.error_msg,
      })
    }
  }

  decreaseItemCount = () => {
    const {itemsCount} = this.state
    if (itemsCount > 1) {
      this.setState(preState => ({
        itemsCount: preState.itemsCount - 1,
      }))
    }
  }

  increaseItemCount = () => {
    this.setState(preState => ({itemsCount: preState.itemsCount + 1}))
  }

  renderSuccessView = () => {
    const {productItemDetails, similarProducts, itemsCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemDetails

    return (
      <>
        <div className="product-item-details-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="details-product-item-container">
            <h1 className="product-item-title">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="rating-reviews-product-container">
              <div className="rating-product-item-container">
                <p className="rating-product-item">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-star-icon"
                />
              </div>
              <p className="review-product-item">{totalReviews} Reviews</p>
            </div>
            <p className="description-product-item">{description}</p>
            <p className="availability-product-item">
              <span className="span-availability-item">Available:</span>{' '}
              {availability}
            </p>
            <p className="brand-product-item">
              <span className="span-brand-product-item">Brand:</span> {brand}
            </p>
            <hr className="hr-line-product-item" />
            <div className="adding-removing-items-container">
              <button
                type="button"
                className="minus-button"
                data-testid="minus"
                onClick={this.decreaseItemCount}
              >
                <BsDashSquare />
              </button>
              <p className="num-of-items-container">{itemsCount}</p>
              <button
                type="button"
                className="plus-button"
                data-testid="plus"
                onClick={this.increaseItemCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-card-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-main-container">
          <div className="similar-products-main-heading-container">
            <h1 className="similar-products-main-heading">Similar Products</h1>
          </div>
          <ul className="list-similar-items-container">
            {similarProducts.map(eachObject => (
              <SimilarProductItem eachObject={eachObject} key={eachObject.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  replaceProductsPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => {
    const {errMsg} = this.state
    return (
      <div className="error-details-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-image-details"
        />
        <h1 className="error-heading-details">{errMsg}</h1>
        <button
          type="button"
          className="error-continue-shopping-button"
          onClick={this.replaceProductsPage}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderSpecificView = () => {
    const {statusResponse} = this.state

    switch (statusResponse) {
      case responseStatus.success:
        return this.renderSuccessView()
      case responseStatus.inProgress:
        return this.renderLoadingView()
      case responseStatus.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-main-container">
        <Header />
        {this.renderSpecificView()}
      </div>
    )
  }
}

export default ProductItemDetails
