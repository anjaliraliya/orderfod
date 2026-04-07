import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, User, MapPin, Star, Clock, UtensilsCrossed, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cart } from './components/Cart'
import { CheckoutModal } from './components/CheckoutModal'
import { OrderHistory } from './components/OrderHistory'
import { DeliveryTracker } from './components/DeliveryTracker'

// Types
interface Dish {
  id: string
  name: string
  price: number
  category: string
  rating: number
  time: string
  image: string
  description: string
}

interface CartItem extends Dish {
  quantity: number
}

const DISHES: Dish[] = [
  {
    id: '1',
    name: 'Classic Margherita Pizza',
    price: 499,
    category: 'Italian',
    rating: 4.8,
    time: '20-25 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    description: 'Fresh basil, gooey mozzarella on a thin, crispy crust.'
  },
  {
    id: '2',
    name: 'Hyderabadi Biryani',
    price: 350,
    category: 'South Indian',
    rating: 4.9,
    time: '30-40 min',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=80',
    description: 'Long-grain basmati rice with tender spices and marinated chicken.'
  },
  {
    id: '3',
    name: 'Creamy Paneer Butter Masala',
    price: 280,
    category: 'North Indian',
    rating: 4.7,
    time: '25-30 min',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    description: 'Rich, buttery tomato gravy with soft protein-rich paneer cubes.'
  },
  {
    id: '4',
    name: 'Fettuccine Alfredo',
    price: 420,
    category: 'Italian',
    rating: 4.6,
    time: '25-30 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    description: 'Creamy parmesan sauce with imported pasta and herbs.'
  },
  {
    id: '5',
    name: 'Dal Makhani',
    price: 240,
    category: 'North Indian',
    rating: 4.8,
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80',
    description: 'Slow-cooked lentils with cream and traditional North Indian spices.'
  },
  {
    id: '6',
    name: 'Crispy Masala Dosa',
    price: 180,
    category: 'South Indian',
    rating: 4.9,
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80',
    description: 'Fermented rice crepe with spicy potato filling.'
  },
  {
    id: '7',
    name: 'Spicy Hakka Noodles',
    price: 220,
    category: 'Chinese',
    rating: 4.7,
    time: '20-25 min',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
    description: 'Wok-tossed noodles with fresh veggies and spicy soy sauce.'
  },
  {
    id: '8',
    name: 'Authentic Street Tacos',
    price: 320,
    category: 'Mexican',
    rating: 4.8,
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
    description: 'Soft corn tortillas filled with seasoned meat, onions, and cilantro.'
  },
  {
    id: '9',
    name: 'Premium Sushi Platter',
    price: 899,
    category: 'Japanese',
    rating: 4.9,
    time: '35-40 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
    description: 'Assorted fresh sashimi and maki rolls with wasabi and soy.'
  },
  {
    id: '10',
    name: 'New York Cheesecake',
    price: 250,
    category: 'Desserts',
    rating: 4.9,
    time: '10-15 min',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80',
    description: 'Classic rich and creamy cheesecake with a graham cracker crust.'
  },
  {
    id: '11',
    name: 'Chocolate Lava Cake',
    price: 180,
    category: 'Desserts',
    rating: 4.8,
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80',
    description: 'Warm, decadent chocolate cake with a molten chocolate center.'
  },
  {
    id: '12',
    name: 'Royal Mango Lassi',
    price: 120,
    category: 'Drinks',
    rating: 4.9,
    time: '5-10 min',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mango_Lassi_.jpg',
    description: 'Thick, creamy yogurt drink blended with sweet Alphonso mangoes.'
  },
  {
    id: '13',
    name: 'Fresh Virgin Mojito',
    price: 150,
    category: 'Drinks',
    rating: 4.7,
    time: '5 min',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/MelissA_Mojito.jpg',
    description: 'Refreshing blend of fresh mint, lime juice, and sparkling soda.'
  },
  {
    id: '14',
    name: 'Iced Americano',
    price: 130,
    category: 'Drinks',
    rating: 4.6,
    time: '5-10 min',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    description: 'Rich, smooth chilled coffee made with premium roasted beans.'
  },
  {
    id: '15',
    name: 'Idli Sambhar',
    price: 120,
    category: 'South Indian',
    rating: 4.8,
    time: '15-20 min',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG',
    description: 'Soft, fluffy steamed rice cakes served with aromatic lentil-based vegetable stew and coconut chutney.'
  }
]

const CATEGORIES = ['All', 'Italian', 'South Indian', 'North Indian', 'Chinese', 'Mexican', 'Japanese', 'Desserts', 'Drinks']

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isTrackerOpen, setIsTrackerOpen] = useState(false)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [deliveryFee, setDeliveryFee] = useState(40)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = (dish: Dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id)
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...dish, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const filteredDishes = selectedCategory === 'All' 
    ? DISHES 
    : DISHES.filter(d => d.category === selectedCategory)

  return (
    <div className="min-h-screen bg-orange-50/30 selection:bg-yellow-200">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl rotate-12">
              <UtensilsCrossed className="text-white -rotate-12" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Vimla <span className="text-primary">Cloud</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
            <a href="#" className="hover:text-primary transition-colors">Services</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 hover:bg-white rounded-full transition-colors relative group"
              title="Order History"
            >
              <Clock size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-white rounded-full transition-colors relative group"
            >
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-gray-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200">
              <User size={18} />
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-yellow-100 text-secondary-hover px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Star size={16} className="fill-current" />
              Top Rated Cloud Kitchen in Town
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
              Delicious <br />
              <span className="text-primary">Food</span> Just A <br />
              <span className="relative">
                Click Away
                <motion.svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 7C20 3 40 1 60 1C80 1 100 3 100 7" stroke="#FACC15" strokeWidth="4" fill="none" />
                </motion.svg>
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md leading-relaxed">
              Experience the authentic taste of Italy and India delivered to your doorstep. We use only the freshest ingredients.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#menu" className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-red-200 flex items-center gap-3 group">
                Order Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                View Menu
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                <span className="text-gray-900 font-black">1.5k+</span> Happy Customers
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200" 
                alt="Main dish" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Info Cards */}
            <motion.div 
              className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Fast Delivery</p>
                <p className="text-sm font-black">25-30 Min</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -right-4 top-20 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border-l-4 border-primary"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-primary">
                <Star size={20} className="fill-current" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold">Best Ranked</p>
                <p className="text-sm font-black">4.9/5 Rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menu Filter */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-primary font-bold tracking-widest uppercase mb-4">Our Delicious Menu</h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">What would you like to eat today?</h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3 rounded-full font-bold transition-all border-2 ${
                    selectedCategory === cat 
                    ? 'bg-secondary border-secondary text-gray-900 shadow-lg shadow-yellow-100' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-secondary hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredDishes.map((dish) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={dish.id}
                  className="group bg-orange-50/50 rounded-[2.5rem] p-6 hover:bg-white hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500"
                >
                  <div className="relative h-60 rounded-[2rem] overflow-hidden mb-6">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                          target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h4 className="text-white font-bold text-lg">{dish.name}</h4>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm font-bold text-sm">
                      <Star size={14} className="text-secondary fill-current" />
                      {dish.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold group-hover:opacity-0 transition-opacity">
                      <Clock size={12} />
                      {dish.time}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-secondary-hover font-bold text-xs uppercase tracking-wider">{dish.category}</span>
                    <span className="text-2xl font-black text-gray-900">₹{dish.price}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2 truncate">{dish.name}</h4>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                  
                  <button 
                    onClick={() => addToCart(dish)}
                    className="w-full bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-red-100"
                  >
                    <Plus size={20} />
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Ambience Gallery */}
      <section className="py-24 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-primary font-bold tracking-widest uppercase mb-4">Our Ambience</h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Experience Royal Dining</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Step into a world of elegance and flavor. Our kitchen isn't just about food; it's about the royal experience we bring to your table.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-8 rounded-[3rem] overflow-hidden shadow-2xl relative group"
            >
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200" 
                alt="Royal Dining Hall" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Grand Dining Hall</h4>
                  <p className="text-gray-200">Exquisite chandeliers and classical decor for a truly royal feel.</p>
                </div>
              </div>
            </motion.div>
            
            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.div 
                whileHover={{ scale: 0.95 }}
                className="flex-1 rounded-[2.5rem] overflow-hidden shadow-xl relative group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" 
                  alt="Modern Luxury" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 0.95 }}
                className="flex-1 rounded-[2.5rem] overflow-hidden shadow-xl relative group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600" 
                  alt="Table Setting" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl">
                  <UtensilsCrossed size={24} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Vimla <span className="text-primary">Cloud</span>
                </h1>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8">
                The most fresh and diverse cloud kitchen providing premium Italian and Indian dishes directly to your door.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Quick Links</h5>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cart</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Contact Info</h5>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary" />
                  Cloud Park Avenue, Sector 5
                </li>
                <li>Email: contact@vimla.com</li>
                <li>Phone: +91 9876543210</li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Newsletter</h5>
              <p className="text-gray-400 mb-6">Subscribe to receive first-hand offers.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-gray-800 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary px-6 rounded-full font-bold text-sm hover:bg-primary-hover transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm font-medium">
            <p>© 2026 Vimla Cloud Kitchen Company. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        deliveryFee={deliveryFee}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={cartSubtotal}
        deliveryFee={deliveryFee}
        setDeliveryFee={setDeliveryFee}
        onSuccess={(id) => {
          setCartItems([])
          setActiveOrderId(id)
        }}
        onTrack={() => {
          setIsCheckoutOpen(false)
          setIsTrackerOpen(true)
        }}
      />

      {/* Order History Drawer */}
      <OrderHistory 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Delivery Tracker */}
      <DeliveryTracker 
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orderId={activeOrderId || undefined}
      />
    </div>
  )
}

export default App
