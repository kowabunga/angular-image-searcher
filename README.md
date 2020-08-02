# AngularImageSearcher

AngularImageSearcher is a single page application devoted to making the process of searching for images across multiple open source libaries quickly and easily.

# AngularImageSearcher supports the following functionalities:

- Searching for images
  - The user can search for images across Unsplash, Pixabay, and Pexels.
  - The user can, once having searched for images, click on the image to see a larger version with details including:
    - Author (with link back to authors page, respectively)
    - Link to hosting site (e.g. Pixabay)
    - Tags/other information associated with the image, made available by the api
  - Infinite scrolling, enabling access to a greater number of images than normally available with a single api request
  - Images are stored within the browser, so that if the user executes a request to another api with the same query, the images returned from the previous api are not lost
