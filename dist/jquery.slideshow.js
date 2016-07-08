/**
 * ================================
 * SlideShow Plugin v1.5
 * Created by Matt Grubb
 * Email: matt-grubb@hotmail.com
 * ================================
 **/
(function($) {
  $.SlideShow = function(el, options) {

    //Set base:
    //==================
    var base = this;
    base.$el = $(el);
    base.el = el;
    base.TotalObjects = base.$el.children('.slideobject').length;
    base.CurrentObject = 1; //Current Image
    base.LoopTimer = null; //Timer
    base.AutoChange = false;
    //==================

    //Plugin Initializer
    base.init = function() {
      base.options = $.extend($.SlideShow.defaults, options);

      if (base.options.loop) {
        base.AutoChange = true;
      }

      //Initial Functions
      //======================
      base.SetupButtons(); //Add buttons to slider
      base.ShowButtons(); //Show the buttons
      base.InitializeSlider(); //Setup Slider
      base.ShowSlide(true); //Show first slide:
      //======================


      //Next Button
      //======================
      base.$el.children('.next').click(function() {
        base.CurrentObject++; //Increment Image
        base.CurrentObject = base.GetSlideID();
        base.ShowSlide(); //Show Slide
        base.HideButtons(); //Hide Buttons
        if (base.options.loop) {
          clearInterval(base.LoopTimer);
          //Play Button Event
          base.LoopTimer = setInterval(function() {
            base.CurrentObject++; //Increment Current by 1
            base.CurrentObject = base.GetSlideID();
            base.ShowSlide(); //Show slide
            base.HideButtons(); //Hide Buttons
          }, base.options.slideDuration);
        }
      });
      //======================

      //Previous Button
      //======================
      base.$el.children('.previous').click(function() {
        base.CurrentObject--; //Increment Image
        base.CurrentObject = base.GetSlideID();
        base.ShowSlide(); //Show Slide
        base.HideButtons(); //Hide Buttons
        if (base.options.loop) {
          clearInterval(base.LoopTimer);
          //Play Button Event
          base.LoopTimer = setInterval(function() {
            base.CurrentObject++; //Increment Current by 1
            base.CurrentObject = base.GetSlideID();
            base.ShowSlide(); //Show slide
            base.HideButtons(); //Hide Buttons
          }, base.options.slideDuration);
        }
      });
      //======================


      /*
        =====================
        If Auto loop is on:
        =====================
      */
      if (base.options.loop) {
        //Automatically star the loop timer:
        //======================================
        base.LoopTimer = setInterval(function() {
          base.CurrentObject++; //Increment Current by 1
          base.CurrentObject = base.GetSlideID();
          base.ShowSlide(); //Show slide
          base.HideButtons(); //Hide Buttons
        }, base.options.slideDuration);
        //======================================

        //If the Infobar is disabled
        //(Add a mouse function to stop)
        //======================================
        if (!base.options.infobar) {
          //Mouse Over (Stop):
          base.$el.mouseover(function() {
            clearInterval(base.LoopTimer);
            //Mouse Out (Start)
          }).mouseout(function() {
            clearInterval(base.LoopTimer);
            base.LoopTimer = setInterval(function() {
              base.CurrentObject++; //Increment Current by 1
              base.CurrentObject = base.GetSlideID();
              base.ShowSlide(); //Show slide
              base.HideButtons(); //Hide Buttons
            }, base.options.slideDuration);
          });
        }
        //======================================
      }

      //If the Infobar is enabled:
      //======================================
      if (base.options.infobar) {
        //Add a Button Click Method:
        base.$el.find('.button').click(function() {
          //If not playing, play it:
          //======================================
          if (!base.options.loop) {
            //Play Button Event
            clearInterval(base.LoopTimer);
            base.ButtonEventHandler('play');
            base.LoopTimer = setInterval(function() {
              base.CurrentObject++; //Increment Current by 1
              base.CurrentObject = base.GetSlideID();
              base.ShowSlide(); //Show slide
              base.HideButtons(); //Hide Buttons
            }, base.options.slideDuration);
            base.options.loop = true;
          }
          //======================================

          //If is playing, stop it:
          //======================================
          else {
            base.ButtonEventHandler('pause');
            clearInterval(base.LoopTimer);
            base.LoopTimer = null;
            base.options.loop = false;
          }
          //======================================
        });


        base.$el.find('.box').click(function() {
          base.CurrentObject = $(this).attr('object-id');
          base.CurrentObject = base.GetSlideID(base.TotalObjects, base.CurrentObject);
          base.ShowSlide(); //Show Slide
          base.HideButtons(); //Hide Buttons
          if (base.options.loop) {
            clearInterval(base.LoopTimer);
            //Play Button Event
            base.LoopTimer = setInterval(function() {
              base.CurrentObject++; //Increment Current by 1
              base.CurrentObject = base.GetSlideID(base.TotalObjects, base.CurrentObject);
              base.ShowSlide(); //Show slide
              base.HideButtons(); //Hide Buttons
            }, base.options.slideDuration);
          }
        });
      }
    };

    //Plugin Methods:
    //================================

    /**
     * Function: InitializeSlider()
     **/
    base.InitializeSlider = function() {

      //Define Variables:
      //======================
      var CountIndex = 1;
      var ContainerHeight = base.$el.parent().height();
      var ContainerWidth = base.$el.parent().width();

      //If Info bar is enabled:
      if (base.options.infobar) {
        //Set CSS Variables:
        var ContainerPadding = 5;
        var BottomBarHeight = 28;
        var ThisHeight = ContainerHeight - (ContainerPadding * 2);
        var ThisWidth = ContainerWidth - (ContainerPadding * 2);
        var ObjectHeight = ContainerHeight - (ContainerPadding * 2) - BottomBarHeight;
        var DescLeft = ContainerPadding;
        var DescBottom = ContainerPadding + BottomBarHeight;
      }
      //If info bar is not enabled:
      else {
        //Set CSS Variables:
        var ThisHeight = ContainerHeight;
        var ThisWidth = ContainerWidth;
        var ObjectHeight = ContainerHeight;
        var DescLeft = 0;
        var DescBottom = 0;
      }
      //======================

      //Set Height and Width:
      //======================
      if (base.options.infobar) {
        base.$el.css({
          padding: ContainerPadding + 'px'
        });
      }
      base.$el.height(ThisHeight + "px");
      base.$el.width(ThisWidth + "px");
      //======================

      //Append the Description
      //======================
      base.$el.append('<div class="desc"></div>');
      base.$el.children('.desc').css({
        position: "absolute",
        bottom: DescBottom + "px",
        left: DescLeft + "px",
        width: ThisWidth
      });
      if (base.options.infobar) {
        base.InitializeInfoBar();
        base.$el.children('.bottom-bar').css({
          width: ThisWidth + "px",
          position: "absolute",
          bottom: ContainerPadding + "px",
          left: ContainerPadding + "px"
        });
      }
      //======================

      //Set Image IDs:
      //======================
      base.$el.children('.slideobject').each(function() {
        $(this).data('title', $(this).attr('title'));
        $(this).removeAttr('title');
        var ObjectID = CountIndex++;
        $(this).attr('object-id', ObjectID);
        $(this).css({
          width: ThisWidth,
          height: ObjectHeight
        });

        if (base.options.infobar) {
          base.$el.find('.box-bar').append('<div class="box" object-id="' + ObjectID + '"></div>');
        }
      });
      //======================
    }

    /**
     * Function: InitializeInfoBar()
     **/
    base.InitializeInfoBar = function() {

      var CurrentButton = null;
      if (base.options.loop) {
        CurrentButton = "pauseButton";
      } else {
        CurrentButton = "playButton";
      }
      base.$el.append('<div class="bottom-bar">' +
        '<div class="box-bar"></div>' +
        '<div class="button ' + CurrentButton + '"></div>' +
        '</div>');
    }

    /**
     * Function: ButtonEventHandler()
     **/
    base.ButtonEventHandler = function(event) {
      //If play
      if (event == "play") {
        //Show pause button
        base.$el.find('.button').removeClass('playButton');
        base.$el.find('.button').addClass('pauseButton');
      }
      //If pause:
      else if (event == "pause") {
        //Show play button
        base.$el.find('.button').removeClass('pauseButton');
        base.$el.find('.button').addClass('playButton');
      }
    }

    /**
     * Function: ShowSlide()
     **/
    base.ShowSlide = function(InitialLoad) {
      //Check Type of InitialLoad
      //======================
      if (typeof InitialLoad == undefined) {
        InitialLoad = false;
      }
      //======================

      //If Infobar is enabled:
      //======================
      if (base.options.infobar) {
        //Iterate through each box tag:
        base.$el.find('.box-bar').children('.box').each(function() {
          if (base.CurrentObject != $(this).attr('object-id')) {
            $(this).removeClass('boxselected');
          } else {
            $(this).addClass('boxselected');
          }
        });
      }

      //Iterate through each Image tag:
      //======================
      base.$el.children('.slideobject').each(function() {

        $(this).bind('mouseover', function() {
          return false;
        });

        //Set Transition:
        var Transition = base.options.transition;

        //If This is the first load of
        //the page, fade it:
        if (InitialLoad) {
          Transition = "fade";
        }

        //Get the Rel attribute from this:
        var Rel = $(this).data('title');
        //Hide image:
        if (base.CurrentObject != $(this).attr('object-id')) {
          $(this).hide();
        }
        //Show Specified Image:
        else {
          //Fade Transition:
          if (Transition == 'fade') {
            $(this).fadeIn(base.options.transSpeed, function() {
              base.ShowButtons();
            });
          }
          //slideLeft Transition:
          else if (Transition == 'slideLeft') {
            $(this).show('slide', {
              direction: 'left'
            }, base.options.transSpeed, function() {
              base.ShowButtons();
            });
          }
          //slideRight Transition:
          else if (Transition == 'slideRight') {
            $(this).show('slide', {
              direction: 'left'
            }, base.options.transSpeed, function() {
              base.ShowButtons();
            });
          }
          //SlideDown Transition:
          else if (Transition == 'slideDown') {
            $(this).show('slide', {
              direction: 'up'
            }, base.options.transSpeed, function() {
              base.ShowButtons();
            });
          }
          //Else load none
          else {
            $(this).fadeIn(base.options.transSpeed, function() {
              base.ShowButtons();
            });
          }
          //Get Span information is there is one:
          if (typeof Rel != undefined) {
            //Get the text from the span:
            var text = $(Rel).html();
            //If the text is not undefined:
            if (text != undefined) {
              base.ShowDescription(text);
            }
            //Hide Desc if undefined:
            else {
              base.HideDescription();
            }
          }
          //If undefined Rel:
          //======================
          else {
            base.HideDescription();
          }
          //======================
        }
      });
      //======================
    }

    /**
     * Function: HideDescription()
     **/
    base.HideDescription = function() {
      //Hide Desc object
      base.$el.children('.desc').html('').hide();
    }

    /**
     * Function: ShowDescription()
     **/
    base.ShowDescription = function(text) {
      //Fade in desc object
      base.$el.children('.desc').html(text).fadeIn();
    }

    /**
     * Function: GetSlideID()
     **/
    base.GetSlideID = function() {
      //If the current image is greater than the total:
      if (base.CurrentObject > base.TotalObjects) {
        base.CurrentObject = 1;
      }
      //If the current image is 0
      else if (base.CurrentObject == 0) {
        base.CurrentObject = base.TotalObjects;
      }
      //Else, its fine.
      else {
        base.CurrentObject = base.CurrentObject;
      }
      //return the current image:
      return base.CurrentObject;
    }

    /**
     * Function: SetupButtons()
     **/
    base.SetupButtons = function() {
      //Append the buttons to the slider:
      base.$el.append('<div class="next"></div><div class="previous"></div>');
      //Set the absolute position of the next button:
      base.$el.children('.next').css({
        position: 'absolute',
        top: '50%',
        right: '15px',
        margin: '-22px 0px 0px 0px'
      });
      //Set the absolute position of the previous button:
      base.$el.children('.previous').css({
        position: 'absolute',
        top: '50%',
        left: '15px',
        margin: '-22px 0px 0px 0px'
      });
    }

    /**
     * Function: HideButtons()
     **/
    base.HideButtons = function() {
      //Hide the Buttons:
      base.$el.children('.next').hide();
      base.$el.children('.previous').hide();
    }

    /**
     * Function: ShowButtons()
     **/
    base.ShowButtons = function() {
      //Show the buttons:
      base.$el.children('.next').show();
      base.$el.children('.previous').show();
    }

    //================================

    //Initialize the plugin
    base.init();
  };

  //Set Plugin defaults:
  $.SlideShow.defaults = {
    slideDuration: '5000', //How fast the slides change:
    transition: 'none',
    transSpeed: '500',
    loop: true,
    infobar: false
  };

  //Run the plugin:
  $.fn.SlideShow = function(options) {
    //Return for each instance
    return this.each(function() {
      (new $.SlideShow(this, options));
    });
  };
})(jQuery);
