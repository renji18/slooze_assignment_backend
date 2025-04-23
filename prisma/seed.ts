import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function addRoles() {
  const roles = ['ADMIN', 'MANAGER', 'MEMBER'];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  console.log('Roles added');
}

async function addCountries() {
  const countries = ['India', 'America'];
  for (const country of countries) {
    await prisma.country.upsert({
      where: { name: country },
      update: {},
      create: { name: country },
    });
  }

  console.log('Countries added');
}

async function addUsers() {
  const users = [
    {
      name: 'Nick Fury',
      email: 'nick@shield.com',
      role: 'ADMIN',
      country: 'India',
    },
    {
      name: 'Captain Marvel',
      email: 'marvel@team.com',
      role: 'MANAGER',
      country: 'India',
    },
    {
      name: 'Captain America',
      email: 'cap@team.com',
      role: 'MANAGER',
      country: 'America',
    },
    {
      name: 'Thanos',
      email: 'thanos@team.com',
      role: 'MEMBER',
      country: 'India',
    },
    { name: 'Thor', email: 'thor@team.com', role: 'MEMBER', country: 'India' },
    {
      name: 'Travis',
      email: 'travis@team.com',
      role: 'MEMBER',
      country: 'America',
    },
  ];

  const password = await bcrypt.hash('password123', 10);

  for (const u of users) {
    const role = await prisma.role.findUnique({ where: { name: u.role } });
    const country = await prisma.country.findUnique({
      where: { name: u.country },
    });

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password,
        roleId: role.id,
        countryId: country.id,
      },
    });
  }

  console.log('Users added');
}

async function addRestaurants() {
  const india = await prisma.country.findUnique({ where: { name: 'India' } });
  const america = await prisma.country.findUnique({
    where: { name: 'America' },
  });

  const restaurants = [
    { name: 'Tandoori Treats', countryId: india.id },
    { name: 'Mumbai Biryani House', countryId: india.id },
    { name: 'Dilli Chaat Bazaar', countryId: india.id },
    { name: 'Burger Planet', countryId: america.id },
    { name: 'New York Pizza Co.', countryId: america.id },
    { name: 'California Sushi Station', countryId: america.id },
  ];

  for (const rest of restaurants) {
    await prisma.restaurant.upsert({
      where: { name: rest.name },
      update: {},
      create: rest,
    });
  }

  console.log('Restaurants added');
}

async function addMenuItems() {
  const allRestaurants = await prisma.restaurant.findMany();

  const items = [
    { name: 'Chicken Tikka', price: 200, restaurantName: 'Tandoori Treats' },
    {
      name: 'Paneer Butter Masala',
      price: 180,
      restaurantName: 'Tandoori Treats',
    },
    { name: 'Tandoori Roti', price: 20, restaurantName: 'Tandoori Treats' },
    { name: 'Dal Makhani', price: 160, restaurantName: 'Tandoori Treats' },
    { name: 'Butter Chicken', price: 220, restaurantName: 'Tandoori Treats' },

    {
      name: 'Chicken Biryani',
      price: 250,
      restaurantName: 'Mumbai Biryani House',
    },
    { name: 'Veg Biryani', price: 200, restaurantName: 'Mumbai Biryani House' },
    { name: 'Egg Biryani', price: 220, restaurantName: 'Mumbai Biryani House' },
    { name: 'Raita', price: 40, restaurantName: 'Mumbai Biryani House' },
    { name: 'Gulab Jamun', price: 70, restaurantName: 'Mumbai Biryani House' },

    {
      name: 'Aloo Tikki Chaat',
      price: 60,
      restaurantName: 'Dilli Chaat Bazaar',
    },
    { name: 'Papdi Chaat', price: 55, restaurantName: 'Dilli Chaat Bazaar' },
    { name: 'Dahi Bhalla', price: 65, restaurantName: 'Dilli Chaat Bazaar' },
    { name: 'Raj Kachori', price: 75, restaurantName: 'Dilli Chaat Bazaar' },
    { name: 'Pani Puri', price: 40, restaurantName: 'Dilli Chaat Bazaar' },

    { name: 'Cheeseburger', price: 85, restaurantName: 'Burger Planet' },
    {
      name: 'Double Patty Burger',
      price: 110,
      restaurantName: 'Burger Planet',
    },
    { name: 'Bacon Burger', price: 120, restaurantName: 'Burger Planet' },
    {
      name: 'Crispy Chicken Burger',
      price: 100,
      restaurantName: 'Burger Planet',
    },
    { name: 'Veggie Burger', price: 90, restaurantName: 'Burger Planet' },

    {
      name: 'Pepperoni Pizza',
      price: 145,
      restaurantName: 'New York Pizza Co.',
    },
    {
      name: 'Veggie Delight Pizza',
      price: 130,
      restaurantName: 'New York Pizza Co.',
    },
    {
      name: 'BBQ Chicken Pizza',
      price: 150,
      restaurantName: 'New York Pizza Co.',
    },
    {
      name: 'Four Cheese Pizza',
      price: 160,
      restaurantName: 'New York Pizza Co.',
    },
    { name: 'Margherita', price: 120, restaurantName: 'New York Pizza Co.' },

    {
      name: 'California Roll',
      price: 100,
      restaurantName: 'California Sushi Station',
    },
    {
      name: 'Tuna Nigiri',
      price: 80,
      restaurantName: 'California Sushi Station',
    },
    {
      name: 'Avocado Roll',
      price: 90,
      restaurantName: 'California Sushi Station',
    },
    {
      name: 'Dragon Roll',
      price: 110,
      restaurantName: 'California Sushi Station',
    },
    {
      name: 'Miso Soup',
      price: 45,
      restaurantName: 'California Sushi Station',
    },
  ];
  for (const item of items) {
    const restaurant = allRestaurants.find(
      (r) => r.name === item.restaurantName,
    );
    if (!restaurant) continue;

    await prisma.menuItem.upsert({
      where: {
        name_restaurantId: {
          name: item.name,
          restaurantId: restaurant.id,
        },
      },
      update: {},
      create: {
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
      },
    });
  }

  console.log('Menu items added');
}

async function addPaymentMethod() {
  await prisma.paymentMethod.upsert({
    where: {
      method: 'card',
    },
    update: {},
    create: {
      method: 'card',
    },
  });

  console.log('Payment Method added');
}

async function main() {
  try {
    await addRoles();
    await addCountries();
    await addUsers();
    await addRestaurants();
    await addMenuItems();
    await addPaymentMethod();
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => console.log('Seed complete'))
  .catch((err) => console.error('Seed error', err))
  .finally(() => prisma.$disconnect());
