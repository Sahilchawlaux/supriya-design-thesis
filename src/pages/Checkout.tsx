
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, X, Trash2, CreditCard, Loader2 } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";

const CheckoutPage = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate("/success");
    }, 2000);
  };

  // if (items.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 min-h-[50vh] flex flex-col items-center justify-center">
  //       <h1 className="text-3xl font-serif mb-6 text-center">Your Cart is Empty</h1>
  //       <p className="text-charcoal-light mb-8 text-center">
  //         You haven't added any items to your cart yet.
  //       </p>
  //       <Button asChild className="bg-gold hover:bg-gold-dark text-white">
  //         <Link to="/collections">Browse Collections</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="bg-cream-light py-12">
  //     <div className="container mx-auto px-4">
  //       <Link to="/collections" className="flex items-center text-charcoal-light hover:text-gold mb-6">
  //         <ArrowLeft size={16} className="mr-2" /> Continue Shopping
  //       </Link>

  //       <h1 className="text-3xl font-serif mb-8">Checkout</h1>

  //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //         {/* Order Summary */}
  //         <div className="lg:col-span-1 order-2 lg:order-1">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Order Summary</CardTitle>
  //             </CardHeader>
  //             <CardContent className="space-y-4">
  //               {items.map((item) => (
  //                 <div key={item.id} className="flex items-center justify-between py-2 border-b">
  //                   <div className="flex items-center">
  //                     <div className="w-16 h-16 rounded overflow-hidden mr-4">
  //                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
  //                     </div>
  //                     <div>
  //                       <h4 className="font-medium">{item.title}</h4>
  //                       <p className="text-charcoal-light text-sm">${item.price.toFixed(2)}</p>
  //                     </div>
  //                   </div>
  //                   <button 
  //                     onClick={() => removeItem(item.id)}
  //                     className="text-charcoal-light hover:text-red-500 transition-colors"
  //                   >
  //                     <X size={18} />
  //                   </button>
  //                 </div>
  //               ))}
                
  //               <div className="flex justify-between py-2 text-sm">
  //                 <span>Subtotal</span>
  //                 <span>${subtotal.toFixed(2)}</span>
  //               </div>
                
  //               <div className="flex justify-between py-2 text-sm">
  //                 <span>Tax</span>
  //                 <span>${(subtotal * 0.07).toFixed(2)}</span>
  //               </div>
                
  //               <div className="flex justify-between py-2 font-medium">
  //                 <span>Total</span>
  //                 <span>${(subtotal + (subtotal * 0.07)).toFixed(2)}</span>
  //               </div>
                
  //               <Button 
  //                 variant="outline" 
  //                 size="sm" 
  //                 className="w-full mt-4 text-red-500 border-red-500 hover:bg-red-500/10"
  //                 onClick={clearCart}
  //               >
  //                 <Trash2 size={16} className="mr-2" /> Clear Cart
  //               </Button>
  //             </CardContent>
  //           </Card>
  //         </div>

  //         {/* Checkout Form */}
  //         <div className="lg:col-span-2 order-1 lg:order-2">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Payment Details</CardTitle>
  //               <CardDescription>
  //                 Complete your purchase by providing your payment details
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <form onSubmit={handleSubmit} className="space-y-6">
  //                 <div className="space-y-4">
  //                   <h3 className="font-medium">Contact Information</h3>
                    
  //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                     <div className="space-y-2">
  //                       <Label htmlFor="name">Full Name</Label>
  //                       <Input
  //                         id="name"
  //                         name="name"
  //                         value={formData.name}
  //                         onChange={handleInputChange}
  //                         required
  //                       />
  //                     </div>
  //                     <div className="space-y-2">
  //                       <Label htmlFor="email">Email Address</Label>
  //                       <Input
  //                         id="email"
  //                         name="email"
  //                         type="email"
  //                         value={formData.email}
  //                         onChange={handleInputChange}
  //                         required
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="space-y-4">
  //                   <h3 className="font-medium">Billing Address</h3>
                    
  //                   <div className="space-y-2">
  //                     <Label htmlFor="address">Address</Label>
  //                     <Input
  //                       id="address"
  //                       name="address"
  //                       value={formData.address}
  //                       onChange={handleInputChange}
  //                       required
  //                     />
  //                   </div>
                    
  //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                     <div className="space-y-2">
  //                       <Label htmlFor="city">City</Label>
  //                       <Input
  //                         id="city"
  //                         name="city"
  //                         value={formData.city}
  //                         onChange={handleInputChange}
  //                         required
  //                       />
  //                     </div>
  //                     <div className="space-y-2">
  //                       <Label htmlFor="zip">ZIP Code</Label>
  //                       <Input
  //                         id="zip"
  //                         name="zip"
  //                         value={formData.zip}
  //                         onChange={handleInputChange}
  //                         required
  //                       />
  //                     </div>
  //                     <div className="space-y-2">
  //                       <Label htmlFor="country">Country</Label>
  //                       <Input
  //                         id="country"
  //                         name="country"
  //                         value={formData.country}
  //                         onChange={handleInputChange}
  //                         required
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="space-y-4">
  //                   <h3 className="font-medium">Payment Method</h3>
                    
  //                   <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
  //                     <TabsList className="grid grid-cols-1 md:grid-cols-2">
  //                       <TabsTrigger value="card">Credit Card</TabsTrigger>
  //                       <TabsTrigger value="paypal">PayPal</TabsTrigger>
  //                     </TabsList>
                      
  //                     <TabsContent value="card" className="space-y-4 mt-4">
  //                       <div className="space-y-2">
  //                         <Label htmlFor="cardNumber">Card Number</Label>
  //                         <Input
  //                           id="cardNumber"
  //                           name="cardNumber"
  //                           value={formData.cardNumber}
  //                           onChange={handleInputChange}
  //                           placeholder="1234 5678 9012 3456"
  //                           required={paymentMethod === "card"}
  //                         />
  //                       </div>
                        
  //                       <div className="grid grid-cols-2 gap-4">
  //                         <div className="space-y-2">
  //                           <Label htmlFor="cardExpiry">Expiry Date</Label>
  //                           <Input
  //                             id="cardExpiry"
  //                             name="cardExpiry"
  //                             value={formData.cardExpiry}
  //                             onChange={handleInputChange}
  //                             placeholder="MM/YY"
  //                             required={paymentMethod === "card"}
  //                           />
  //                         </div>
  //                         <div className="space-y-2">
  //                           <Label htmlFor="cardCvc">CVC/CVV</Label>
  //                           <Input
  //                             id="cardCvc"
  //                             name="cardCvc"
  //                             value={formData.cardCvc}
  //                             onChange={handleInputChange}
  //                             placeholder="123"
  //                             required={paymentMethod === "card"}
  //                           />
  //                         </div>
  //                       </div>
  //                     </TabsContent>
                      
  //                     <TabsContent value="paypal" className="mt-4">
  //                       <p className="text-charcoal-light text-sm">
  //                         You will be redirected to PayPal to complete your purchase securely.
  //                       </p>
  //                     </TabsContent>
  //                   </Tabs>
  //                 </div>

  //                 <Button 
  //                   type="submit" 
  //                   className="w-full bg-gold hover:bg-gold-dark text-white"
  //                   disabled={isProcessing}
  //                 >
  //                   {isProcessing ? (
  //                     <>
  //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                       Processing...
  //                     </>
  //                   ) : (
  //                     <>
  //                       <CreditCard className="mr-2 h-4 w-4" />
  //                       Pay ${(subtotal + (subtotal * 0.07)).toFixed(2)}
  //                     </>
  //                   )}
  //                 </Button>
                  
  //                 <p className="text-xs text-center text-charcoal-light mt-4">
  //                   By completing this purchase, you agree to our Terms of Service and Privacy Policy.
  //                 </p>
  //               </form>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return <ComingSoon />
};

export default CheckoutPage;
