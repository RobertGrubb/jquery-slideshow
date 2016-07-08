# JQuery SlideShow

JQuery SlideShow is a light-weight slideshow made with JQuery. It allows you to show images, and videos, and descriptions for each slide.

## How to use:

Download the files in `dist`:

- `jquery-slideshow.css`
- `jquery.slideshow.js`

Then, in your html file, add these in the header:

```
  <link href="dist/jquery-slideshow.css" type="text/css" rel="stylesheet" />
  <script src="dist/jquery.slideshow.js" type="text/javascript"></script>
```

After that, all you have to do is instantiate the SlideShow:

```
  <script type="text/javascript">
      $(document).ready(function(){
          //Load the SlideShow
          $('#SlideShow').SlideShow({
            slideDuration: 8000,
            transSpeed: 300,
            loop: true,
            infobar: true
          });
      });
  </script>
```
