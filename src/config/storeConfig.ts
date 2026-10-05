import { StoreConfig, PaymentConfig } from '../types';

export const STORE_CONFIG: StoreConfig = {
  brandName: 'Diwali Mart',
  tagline: 'Light Up Your Diwali with Great Electronics Deals',
  announcementText: '🪔 Diwali Mega Sale — Special Electronics Prices',
  defaultCurrency: 'INR',
  defaultDeliveryFee: 0,
  defaultDiscount: 0,
  categories: [
    {
      name: 'Smartphones / Mobiles',
      slug: 'smartphones-mobiles',
      icon: 'smartphone',
      description: 'Flagships, mid-range & Diwali festival special edition smartphones'
    },
    {
      name: 'TVs / Smart TVs',
      slug: 'tvs-smart-tvs',
      icon: 'tv',
      description: '4K QLED, OLED & Ultra HD Smart TVs with immersive cinema displays'
    },
    {
      name: 'Home Appliances',
      slug: 'home-appliances',
      icon: 'refrigerator',
      description: 'Air purifiers, washing machines, refrigerators & smart home cleaning'
    },
    {
      name: 'Personal Electronics',
      slug: 'personal-electronics',
      icon: 'watch',
      description: 'Smartwatches, tablets, power banks, fitness bands & gadgets'
    },
    {
      name: 'Computers / Laptops',
      slug: 'computers-laptops',
      icon: 'laptop',
      description: 'Gaming rigs, thin & light productivity ultrabooks & monitors'
    },
    {
      name: 'Small Kitchen Appliances',
      slug: 'small-kitchen-appliances',
      icon: 'coffee',
      description: 'Air fryers, mixer grinders, electric kettles & induction cookers'
    },
    {
      name: 'Audio / Speakers',
      slug: 'audio-speakers',
      icon: 'headphones',
      description: 'Noise-cancelling headphones, Dolby Atmos soundbars & party speakers'
    }
  ]
};

export const PAYMENT_CONFIG: PaymentConfig = {
  upiId: 'diwalimart@axl',
  payeeName: 'Diwali Mart',
  staticQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Ddiwalimart%40axl%26pn%3DDiwali%2520Mart%26cu%3DINR',
  dynamicQrEnabled: true,
  upiIntentEnabled: true,
  currency: 'INR'
};
