import { Context } from 'hono';
import { getCurrentUser } from '@/auth';

export const onRequestGet = async (c: Context) => {
const currentUser = await getCurrentUser(c);
const isAdmin = !!currentUser?.admin;
const libraryPath = isAdmin ? '/dashboard/items' : '/library';
const dashboardPath = isAdmin ? '/dashboard' : '/dashboard/profile';

return c.render(
    <>
        {/* Hero Section */}
        <div class="bg-gradient-to-br from-[#003865] via-blue-800 to-blue-700 text-white">
            <div class="max-w-6xl mx-auto px-6 py-16">
                <div class="text-center">
                    <div class="bg-white rounded-lg p-4 inline-block">
                    <img src="/statics/SHWLogo.png" alt="School of Health and Well Being Logo" class="w-48 h-auto mx-auto mb-8 rounded-lg shadow-lg" />
                    </div>
                    <h1 class="text-5xl font-bold mb-6">Tool Library</h1>
                    <p class="text-lg mb-8 max-w-3xl mx-auto">
                        Empowering students and staff with access to essential equipment for research, projects, and innovation.
                    </p>
                    <a href={libraryPath} class="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block">
                        Browse Equipment
                    </a>
                </div>
            </div>
        </div>

        {/* About Section */}
        <div class="py-16 bg-gray-50">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">About the School of Health and Well Being</h2>
                        <p class="text-gray-600 mb-4 max-w-lg mx-auto">
                            The University of Glasgow's School of Health and Well Being is dedicated to advancing health sciences
                            through innovative research, education, and community engagement. Our school brings together expertise
                            in nursing, physiotherapy, occupational therapy, and health promotion.
                        </p>
                        <p class="text-gray-600 mb-4 max-w-lg mx-auto">
                            We are committed to developing the next generation of healthcare professionals and researchers who will
                            make a positive impact on society through evidence-based practice and cutting-edge research.
                        </p>
                    </div>
                    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h3 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center justify-center">
                                <span class="text-blue-600 mr-2">•</span>
                                Advance health sciences through research and education
                            </li>
                            <li class="flex items-center justify-center">
                                <span class="text-blue-600 mr-2">•</span>
                                Develop skilled healthcare professionals
                            </li>
                            <li class="flex items-center justify-center">
                                <span class="text-blue-600 mr-2">•</span>
                                Promote health and well-being in communities
                            </li>
                            <li class="flex items-center justify-center">
                                <span class="text-blue-600 mr-2">•</span>
                                Foster innovation in healthcare practices
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Tool Library Section */}
        <div class="py-16 bg-white">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">The Tool Library Initiative</h2>
                        <img src="/statics/ClaricePearce.jpg" alt="Clarice PearceBuilding" class="w-auto h-56 mx-auto mb-8 rounded-lg shadow-lg" />

                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our Tool Library provides students and staff with access to specialized equipment and tools
                        necessary for their academic and research endeavors.
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 text-md">
                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Extensive Equipment Collection</h3>
                        <p class="text-gray-600">
                            Access to a wide range of specialized tools and equipment for research, prototyping, and project work.
                        </p>
                    </div>

                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Available to All</h3>
                        <p class="text-gray-600">
                            Open to all University of Glasgow students and staff members in the School of Health and Well Being.
                        </p>
                    </div>

                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy Booking System</h3>
                        <p class="text-gray-600">
                            Simple online booking system with clear availability and easy-to-follow checkout procedures.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Call to Action */}
        <div class="bg-[#003865] text-white py-16">
            <div class="max-w-4xl mx-auto px-6 text-center">
                <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p class="text-xl mb-8 text-blue-100">
                    Explore our collection of equipment and reserve what you need for your next project.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={libraryPath} class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        View Equipment
                    </a>
                    <a href={dashboardPath} class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                        My Dashboard
                    </a>
                </div>
            </div>
        </div>

    </>
    );
};