# buddy
This is a web api to manage my buddy circle.

## Installation

First, clone this repository:

<!-- start:code block -->
# Clone this repository
git clone https://github.com/farhadgharaie/buddy.git
cd buddy

# Install dependencies
npm install

# Copy the example .env file
cp .env.example .env

# Initialize the database
npx prisma generate
npx prisma db push

# Run the app
npm run dev

# Access APIs on http://localhost:3000
call http://localhost:3000
<!-- end:code block -->