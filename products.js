// Product Database
const products = {
    'lavender': {
        id: 'lavender',
        name: 'Lavender',
        price: 6.00,
        image: 'images/lavender.jpg',
        description: 'Soothing lavender essential oil creates a calming, spa-like experience. Perfect for relaxation and gentle cleansing.',
        ingredients: 'Olive oil, coconut oil, shea butter, lavender essential oil, natural colorants',
        benefits: [
            'Calming and relaxing scent',
            'Gentle on sensitive skin',
            'Moisturizing and nourishing',
            'Natural essential oils'
        ],
        scentFamily: ['floral'],
        seasonal: false,
        bestseller: true,
        inStock: true
    },
    'cedarwood': {
        id: 'cedarwood',
        name: 'Cedarwood, Frankincense & Patchouli',
        price: 6.00,
        image: 'images/cedarwood.jpg',
        description: 'A rich, earthy blend of cedarwood, frankincense, and patchouli. Grounding and luxurious.',
        ingredients: 'Olive oil, coconut oil, shea butter, cedarwood essential oil, frankincense essential oil, patchouli essential oil, natural colorants',
        benefits: [
            'Grounding and earthy aroma',
            'Deeply moisturizing',
            'Suitable for all skin types',
            'Long-lasting fragrance'
        ],
        scentFamily: ['woody'],
        seasonal: false,
        bestseller: true,
        inStock: true
    },
    'lemongrass-strawflower': {
        id: 'lemongrass-strawflower',
        name: 'Lemongrass with Strawflower Petals',
        price: 6.00,
        image: 'images/lemongrass-strawflower.jpg',
        description: 'Fresh lemongrass essential oil with beautiful dried strawflower petals. Uplifting and refreshing.',
        ingredients: 'Olive oil, coconut oil, shea butter, lemongrass essential oil, dried strawflower petals, natural colorants',
        benefits: [
            'Fresh, citrusy scent',
            'Natural exfoliation from petals',
            'Energizing and uplifting',
            'Visually stunning'
        ],
        scentFamily: ['citrus', 'floral'],
        seasonal: false,
        bestseller: false,
        inStock: true
    },
    'lemongrass-exfoliating': {
        id: 'lemongrass-exfoliating',
        name: 'Lemongrass with Exfoliating Oats & Tea Tree Oil & Coconut Oil',
        price: 6.00,
        image: 'images/lemongrass-exfoliating.jpg',
        description: 'Refreshing lemongrass combined with gentle exfoliating oats, purifying tea tree oil, and moisturizing coconut oil.',
        ingredients: 'Olive oil, coconut oil, shea butter, lemongrass essential oil, tea tree oil, ground oats, natural colorants',
        benefits: [
            'Gentle exfoliation',
            'Purifying tea tree oil',
            'Fresh citrus scent',
            'Deep cleansing'
        ],
        scentFamily: ['citrus', 'fresh'],
        seasonal: false,
        bestseller: true,
        inStock: true
    },
    'cucumber-melon': {
        id: 'cucumber-melon',
        name: 'Cucumber Melon',
        price: 6.00,
        image: 'images/cucumber-melon.jpg',
        description: 'Light, refreshing cucumber melon fragrance. Perfect for everyday use and all skin types.',
        ingredients: 'Olive oil, coconut oil, shea butter, cucumber melon fragrance oil, natural colorants',
        benefits: [
            'Light and refreshing',
            'Hydrating formula',
            'Perfect for daily use',
            'Suitable for all skin types'
        ],
        scentFamily: ['fresh'],
        seasonal: false,
        bestseller: false,
        inStock: true
    },
    'peppermint': {
        id: 'peppermint',
        name: 'Peppermint',
        price: 6.00,
        image: 'images/peppermint.jpg',
        description: 'Cool, invigorating peppermint essential oil. A winter favorite that awakens the senses.',
        ingredients: 'Olive oil, coconut oil, shea butter, peppermint essential oil, natural colorants',
        benefits: [
            'Cooling and refreshing',
            'Invigorating scent',
            'Perfect for winter',
            'Awakens the senses'
        ],
        scentFamily: ['minty'],
        seasonal: true,
        bestseller: false,
        inStock: true
    },
    'sugar-cookie': {
        id: 'sugar-cookie',
        name: 'Sugar Cookie',
        price: 6.00,
        image: 'images/sugar-cookie.jpg',
        description: 'Sweet, comforting sugar cookie fragrance. Smells like freshly baked holiday treats.',
        ingredients: 'Olive oil, coconut oil, shea butter, sugar cookie fragrance oil, natural colorants',
        benefits: [
            'Sweet, comforting scent',
            'Holiday favorite',
            'Moisturizing formula',
            'Perfect for gifting'
        ],
        scentFamily: ['sweet'],
        seasonal: true,
        bestseller: false,
        inStock: true
    },
    'christmas-wreath': {
        id: 'christmas-wreath',
        name: 'Christmas Wreath',
        price: 6.00,
        image: 'images/christmas-wreath.jpg',
        description: 'Fresh evergreen and winter berry scent. Brings the holiday spirit to your shower.',
        ingredients: 'Olive oil, coconut oil, shea butter, pine essential oil, winter berry fragrance, natural colorants',
        benefits: [
            'Festive holiday scent',
            'Fresh evergreen aroma',
            'Limited edition',
            'Perfect for the season'
        ],
        scentFamily: ['fresh', 'woody'],
        seasonal: true,
        bestseller: false,
        inStock: true
    }
};

// Get all products as array
function getAllProducts() {
    return Object.values(products);
}

// Get product by ID
function getProductById(id) {
    return products[id];
}

// Get products by filter
function getProductsByFilter(filters) {
    let filtered = getAllProducts();
    
    // Filter by seasonal
    if (filters.seasonal !== undefined) {
        filtered = filtered.filter(p => p.seasonal === filters.seasonal);
    }
    
    // Filter by bestseller
    if (filters.bestseller !== undefined) {
        filtered = filtered.filter(p => p.bestseller === filters.bestseller);
    }
    
    // Filter by scent family
    if (filters.scentFamily && filters.scentFamily.length > 0) {
        filtered = filtered.filter(p => 
            p.scentFamily.some(family => filters.scentFamily.includes(family))
        );
    }
    
    // Filter by in stock
    if (filters.inStock !== undefined) {
        filtered = filtered.filter(p => p.inStock === filters.inStock);
    }
    
    return filtered;
}
