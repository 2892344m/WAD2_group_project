import { Context } from 'hono';
import { getCurrentUser } from '../../auth';

export const onRequestGet = async (c: Context) => {
  const currentUser = await getCurrentUser(c);

  if (!currentUser || !currentUser.user) {
    return c.redirect('/login');
  }

  const { user, admin } = currentUser;

  return c.render(
    <>
      {/* Hero Section */}
      <div class="bg-gradient-to-br from-[#003865] via-blue-800 to-blue-700 text-white shadow-md">
        <div class="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div class="flex flex-col md:flex-row items-center gap-6 justify-between">
            
            {/* User Greeting (Left Side) */}
            <div class="text-center md:text-left">
              <h1 class="text-5xl md:text-6xl font-bold mb-2">{user.name}</h1>
              <p class="text-blue-100 text-lg max-w-2xl">
                {user.email}
              </p>
            </div>

            {/* Role Badge (Right Side) */}
            <span class={`px-6 py-2 rounded-full text-base font-semibold tracking-wide backdrop-blur-md border ${
              admin 
                ? "bg-purple-500/20 border-purple-300/50 text-purple-100" 
                : "bg-white/20 border-white/30 text-white"
            }`}>
              {admin ? "ADMINISTRATOR" : "STUDENT"}
            </span>

          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-6xl mx-auto px-6">
          
          <div class="grid md:grid-cols-3 gap-8">
            
            {/* Left Column: Account Details */}
            <div class="md:col-span-2 space-y-8">
              
              {/* Card 1: Identity */}
              <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 class="text-2xl font-bold text-[#003865] mb-6 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Identity Information
                </h2>
                
                <div class="grid sm:grid-cols-2 gap-8">
                  <div>
                    <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p class="text-lg text-gray-900 font-medium">{user.name}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                    <p class="text-lg text-gray-900 font-medium">{user.email}</p>
                  </div>

                  <div>
                    <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">User ID</p>
                    <p class="text-lg font-mono text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-md border border-gray-200">
                      {user.uid}
                    </p>
                  </div>

                  <div>
                    <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Role Status</p>
                    <div class="flex items-center gap-2">
                      <div class={`w-2 h-2 rounded-full ${admin ? "bg-purple-500" : "bg-blue-500"}`}></div>
                      <p class="text-lg text-gray-900 font-medium">
                        {admin ? "Full Admin Access" : "Standard Library Access"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Status */}
              <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                 <h2 class="text-2xl font-bold text-[#003865] mb-4">Account Status</h2>
                 <p class="text-gray-600">
                    Your account is currently <strong>Active</strong>. You have access to borrow equipment from the Tool Library 
                    and make reservation requests.
                 </p>
              </div>

            </div>

            {/* Right Column: Actions */}
            <div class="space-y-6">
              
              <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Manage Profile</h3>
                <p class="text-gray-600 text-sm mb-6">
                  Update your personal information or manage your session security.
                </p>
                
                <div class="space-y-3">
                  <button class="w-full bg-[#003865] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2">
                    Edit Details
                  </button>
                  
                  <a href="/logout" class="w-full border-2 border-red-100 text-red-600 bg-red-50 px-6 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    Log Out
                  </a>
                </div>
              </div>

              {/* Helpful Links */}
              {admin ? (
                 <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 class="font-bold text-blue-900 mb-2">Admin Console</h4>
                    <p class="text-sm text-blue-800 mb-4">Quickly return to the main dashboard.</p>
                    <a href="/dashboard" class="text-sm font-semibold text-blue-600 hover:underline">Go to Dashboard →</a>
                 </div>
              ) : (
                <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 class="font-bold text-blue-900 mb-2">Need Equipment?</h4>
                    <p class="text-sm text-blue-800 mb-4">Browse our collection of tools available for loan.</p>
                    <a href="/library" class="text-sm font-semibold text-blue-600 hover:underline">Go to Library →</a>
                 </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
};