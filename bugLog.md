1. Raw SQL query -- was stuck on creating a query for users we have matched with that have also matched with us.

2. s3 -- how to upload files to our bucket and give bucket public access AND return image url

3. Seed data - omg there is a lot to do

4. multer uploads folder

5. Organizing the architecture of state, useEffect with matches, potentials.

6. Toasts being blocked by the Loader.

7. Upon deployment, CORS issue even tho CORS is enabled in app? Okay not CORS issue, the console is gaslighting me. Only the auth routes were not working (requests left hanging) and this was because the async router functions, which potentially throw errors, did not incorporate try/catch blocks to handle throws. Read up on unhandled rejections.
