export default function ContactUs() {
  return (
    <div className=" flex flex-col items-center px-6 py-12 dark:bg-themedark bg-gray-100">
      <div className="dark:text-white shadow-lg rounded-lg p-8 max-w-lg w-full dark:shadow-darkshadow dark:bg-[#373737f8]">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6 ">Contact Us</h2>

        <form className="space-y-4 "> 
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full px-4 dark:bg-lighterthemedark dark:text-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your Name" required />
          </div>
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 dark:bg-lighterthemedark dark:text-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your Email" required />
          </div>
          <div>
            <label className="block dark:text-white text-gray-700 font-medium mb-1">Message</label>
            <textarea className="w-full px-4 dark:bg-lighterthemedark dark:text-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="4" placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition">Send Message</button>
        </form>
      </div>
    </div>
  );
}
