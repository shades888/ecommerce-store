
import React, { createContext, useContext, useState, useEffect} from 'react';
import { toast} from 'react-hot-toast';


const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
           
            
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems);
            
        } else{
            product.quantity = quantity;

            setCartItems([...cartItems, {...product}]);
        }
         toast.success(`${qty} ${product.name} added to cart`);
    }

    const onRemove = (product) => {
        const foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }
    const toggleCartItemQuantity = (id, value) => {
        const updatedCartItems = cartItems.map((item) => {
          if (item._id === id) {
            const updatedItem = { ...item };
            updatedItem.quantity += value === 'inc' ? 1 : -1;
            return updatedItem;
          }
          return item;
        });
      
        setCartItems(updatedCartItems);
        
        const foundProduct = cartItems.find((item) => item._id === id);
        const itemPrice = foundProduct.price;
        const itemQuantity = foundProduct.quantity + (value === 'inc' ? 1 : -1);
      
        setTotalPrice((prevTotalPrice) => prevTotalPrice + (value === 'inc' ? itemPrice : -itemPrice));
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + (value === 'inc' ? 1 : -1));
      };
      

    //Increase quantity call back function
    const incQty = () => {
    setQty((prevQty) => prevQty + 1)  
    }
    //Decrease quantity call back function
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });  
        }
    
    return (
        <Context.Provider 
        value={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            setCartItems,
            setTotalPrice,
            setTotalQuantities,
            onRemove
            
        }}>
            {children}
        </Context.Provider>
    )
}
//allows the use of the state as a hook
export const useStateContext = () => useContext(Context);


