import React from "react";
import background from "../assets/background.jpg";
import storyPhoto from "../assets/story.png";
import fm from "../assets/fmlogo.png";
import fs from "../assets/fs.jpg";
import ds from "../assets/ds.png";
export default function AboutUs() {
  return (
    <div className="font-sans text-black">
      {/* Hero Section */}
      <section className="relative">
        <img
          src={background}
          alt="Food dishes"
          className="w-full h-64 object-cover opacity-75"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
          About Us
        </h1>
      </section>

      {/* About Section */}
      <section className="p-8 bg-gray-50 flex flex-col md:flex-row gap-4 items-start">
        {/* Image Section */}
        <div className="w-full md:w-1/2 transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg">
          <img
            src={storyPhoto}
            alt="Our Story"
            className="w-full h-auto object-cover rounded-md shadow-lg"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 h-full bg-[#EFD6A9] p-8 rounded-md shadow-md flex flex-col justify-between transition duration-500 ease-in-out hover:shadow-xl hover:bg-[#EFD6A9]/90 hover:scale-105">
          <header className="mb-4">
            <h2 className="text-3xl font-bold">FoodMate Restaurant</h2>
          </header>
          <article className="text-lg leading-relaxed space-y-4 flex-grow">
            <p>
              Eating out at a restaurant of your choice is always an enjoyable
              experience. Make it a memorable one by dining in with us in an
              ambiance that boasts of a 100-year-old history located between
              Thapathali Bridge and Pulchowk, where the Hotel Himalaya is
              situated.
            </p>
            <p>
              Kupondole is not only famous for its fine restaurants but also has
              lots of boutiques and handicraft outlets. It used to be an
              important fashion hub before the big malls opened in Kathmandu. As
              for handicraft shops, most of the big players like Dhukuti,
              Mahaguthi, Sana Hastakala, and so on have their main outlets over
              here. You can also find lots of foreign organizations/offices
              nearby, and a lot of expatriates have made this neighborhood their
              home. So, we couldn’t be better located than this.
            </p>
          </article>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#EFD6A9]  p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 text-center bg-white">
          {/* Service Items */}
          {[
            {
              img: fm,
              title: "Food Management",
              description: "Food Management",
            },
            {
              img: fs,
              title: "Fast Food",
              description: "Fast Service",
            },
            {
              img: ds,
              title: "Delivery Service",
              description: "Online delivery services",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center transition duration-500 ease-in-out transform hover:scale-110 hover:shadow-lg"
            >
              <img
                src={service.img}
                alt={service.title}
                className="mb-4 w-20 h-20"
              />
              <h3 className="font-bold">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        {/* Footer Section
        <div className="text-center mt-8">
          <h3 className="text-xl font-bold">FoodMate,</h3>
          <p>We provide our best service</p>
        </div> */}
      </section>
    </div>
  );
}
