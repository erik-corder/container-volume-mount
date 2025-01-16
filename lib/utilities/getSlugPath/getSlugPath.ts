export const getSlugPath = (contentType: string, slug: string = '') => {
  switch (contentType) {
    // collection types
    case 'about-us-static':
      return `/about-us/${slug}`

    case 'integration':
      return `/integrations/${slug}`

    case 'promotion':
      return `/promotions/${slug}`

    case 'service':
      return `/services/${slug}`

    case 'product':
      return `/product/${slug}`

    // single types
    case 'about-us':
      return '/about-us'

    case 'brand-home-page':
      return '/brands/shop-by-brands'

    case 'disclaimer':
      return '/terms/disclaimer'

    case 'privacy-policy':
      return '/terms/privacy-policy'

    case 'returns-policy':
      return '/terms/returns-policy'

    case 'shipping-detail':
      return '/terms/shipping-detail'

    case 'terms-and-condition':
      return '/terms/terms-and-condition'

    case 'special-services-landing-page':
      return '/services'

    case 'support-availability':
      return '/support/support-availability'

    case 'support-coming-soon':
      return '/support/support-coming-soon'

    case 'support-contracted-item':
      return '/support/support-contracted-item'

    case 'support-welcome':
      return '/support/support-welcome'

    default:
      return false
  }
}

export default getSlugPath
