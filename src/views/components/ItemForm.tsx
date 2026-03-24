export type ItemFormProps = {
  action: string;
  mode: 'add' | 'edit';
  defaultValues?: {
    name?: string;
    description?: string;
    manual?: string;
    imageDir?: string;
    availability?: string;
    itemID?: string | number;
    status?: string;
  };
  error?: string | null;
  success?: string | null;
};

export const ItemForm = ({ action, mode, defaultValues = {}, error, success }: ItemFormProps) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? `Edit Item #${defaultValues.itemID}` : 'Add New Equipment Item';
  const buttonText = isEdit ? 'Save Changes' : 'Add Item';

  return (
    <div class="w-full max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{title}</h1>
        {isEdit && <a href="/dashboard/items" class="text-blue-600 hover:underline">← Back to List</a>}
      </div>

      {success && (
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 font-medium">
            ✓ {isEdit ? 'Item updated successfully!' : 'Item added successfully!'}
          </p>
        </div>
      )}

      {error && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 font-medium">✗ {decodeURIComponent(error)}</p>
        </div>
      )}

      <form method="POST" action={action} enctype="multipart/form-data" class="bg-white shadow-md rounded-lg p-8 space-y-6">
        <div class="border-b pb-4 mb-4">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Equipment Type Information
            {isEdit && <span class="text-sm font-normal text-gray-500 ml-2">(Updates apply to ALL items of this type)</span>}
          </h2>

          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={defaultValues.name || ''}
                readonly={isEdit}
                class={`w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEdit ? 'bg-gray-50 text-gray-700' : ''}`}
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              >{defaultValues.description || ''}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="manual" class="block text-sm font-medium text-gray-700 mb-2">
                  Manual URL <span class="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="manual"
                  name="manual"
                  required
                  value={defaultValues.manual || ''}
                  class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Enhanced Image Upload / Drag and Drop */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Equipment Image</label>
                <div 
                  id="dropzone"
                  class="relative group w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                >
                  <div id="dropzone-prompt" class={`text-center ${defaultValues.imageDir ? 'hidden' : ''}`}>
                    <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-1 text-sm text-gray-500">Drag and drop or click to upload</p>
                  </div>
                  
                  {/* Image Preview Container */}
                  <div id="preview-container" class={`absolute inset-0 p-2 ${!defaultValues.imageDir ? 'hidden' : ''}`}>
                    <img 
                      id="preview-img" 
                      src={defaultValues.imageDir ? `/statics/${defaultValues.imageDir}` : ''} 
                      class="w-full h-full object-contain rounded" 
                    />
                    <button type="button" id="remove-img" class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <input type="file" id="imageInput" name="imageFile" accept="image/*" class="hidden" />
                  <input type="hidden" id="imageDir" name="imageDir" value={defaultValues.imageDir || ''} />
                </div>
              </div>
            </div>

            <div>
              <label for="availability" class="block text-sm font-medium text-gray-700 mb-2">Availability Notes</label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={defaultValues.availability || ''}
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="border-b pb-4 mb-4">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Specific Item Instance</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="itemID" class="block text-sm font-medium text-gray-700 mb-2">
                Item ID <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="itemID"
                name="itemID"
                required
                value={defaultValues.itemID || ''}
                readonly={isEdit}
                class={`w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status...</option>
                <option value="available" selected={defaultValues.status?.toLowerCase() === 'available'}>Available</option>
                <option value="checked-out" selected={defaultValues.status?.toLowerCase() === 'checked-out'}>Checked Out</option>
                <option value="maintenance" selected={defaultValues.status?.toLowerCase() === 'maintenance'}>Maintenance</option>
                <option value="retired" selected={defaultValues.status?.toLowerCase() === 'retired'}>Retired</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" class="flex-1 bg-[#003865] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-900 transition">
            {buttonText}
          </button>
          <a href="/dashboard/items" class="flex-1 bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-50">
            Cancel
          </a>
        </div>
      </form>

      {/* Drag & Drop Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        const dz = document.getElementById('dropzone');
        const input = document.getElementById('imageInput');
        const hiddenInput = document.getElementById('imageDir');
        const preview = document.getElementById('preview-container');
        const previewImg = document.getElementById('preview-img');
        const prompt = document.getElementById('dropzone-prompt');
        const removeBtn = document.getElementById('remove-img');

        dz.addEventListener('click', () => input.click());

        dz.addEventListener('dragover', (e) => {
          e.preventDefault();
          dz.classList.add('border-blue-500', 'bg-blue-50');
        });

        dz.addEventListener('dragleave', () => {
          dz.classList.remove('border-blue-500', 'bg-blue-50');
        });

        dz.addEventListener('drop', (e) => {
          e.preventDefault();
          dz.classList.remove('border-blue-500', 'bg-blue-50');
          if (e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            handleFiles(e.dataTransfer.files[0]);
          }
        });

        input.addEventListener('change', () => {
          if (input.files.length) handleFiles(input.files[0]);
        });

        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          input.value = '';
          hiddenInput.value = '';
          preview.classList.add('hidden');
          prompt.classList.remove('hidden');
        });

        function handleFiles(file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImg.src = e.target.result;
            preview.classList.remove('hidden');
            prompt.classList.add('hidden');
          };
          reader.readAsDataURL(file);

          const formData = new FormData();
          formData.append('image', file);
          
          fetch('/api/upload-image', {
            method: 'POST',
            body: formData
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              hiddenInput.value = data.filename;
            } else {
              alert(data.error || 'Upload failed');
            }
          })
          .catch(err => {
            console.error('Upload error:', err);
            alert('Network error during upload');
          });
        }
      `}} />
    </div>
  );
};