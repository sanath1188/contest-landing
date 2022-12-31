import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import smoothscroll from 'smoothscroll-polyfill';
import { HomepageService } from './services/homepage.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var jquery: any;
declare var $: any;

declare let ga:  Function;
declare let fbq: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('phone') phoneNumberEl: ElementRef;
	@ViewChild("howToDesktopCarouselEl") howToDesktopCarouselEl;


  showMobileMenu: boolean = false;

  contactNumber: string = null;
  linkSent: boolean = false;
  enableGetLinkNow : boolean = false;

  mobile: boolean = false;
  tab: boolean = false;
  howData: any = [
    {
      src: 'assets/images/how/1.png'
    },
    {
      src: 'assets/images/how/2.png'
    },
    {
      src: 'assets/images/how/3.png'
    },
    {
      src: 'assets/images/how/4.png'
    },
    {
      src: 'assets/images/how/5.png'
    },
    {
      src: 'assets/images/how/6.png'
    }
  ];

  howToCarouselLoaded: boolean = true;

  knowData: any = [
    {
      src: 'https://via.placeholder.com/514x928'
    },
    {
      src: 'https://via.placeholder.com/514x928'
    },
    {
      src: 'https://via.placeholder.com/514x928'
    }
  ];


  howToDesktopCarousel: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 48,
    navSpeed: 700,
    navText: [`<img style="position: absolute; top: 12vw; height: 40px; width: 40px" src='../../assets/images/carousel/prev_active.svg'>`,
      `<img style="position: absolute; top: 12vw; right: 0; height: 40px; width: 40px" src='../../assets/images/carousel/next_active.svg'>`],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      },
      1200: {
        items: 3
      },
      1440: {
        items: 3
      }
    },
    nav: true
  };

  knowDesktopCarousel: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 48,
    navSpeed: 700,
    navText: [`<img style="position: absolute; top: 12vw; height: 40px; width: 40px" src='../../assets/images/carousel/prev_active.svg'>`,
      `<img style="position: absolute; top: 12vw; right: 0; height: 40px; width: 40px" src='../../assets/images/carousel/next_active.svg'>`],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      },
      1200: {
        items: 3
      },
      1440: {
        items: 3
      }
    },
    nav: true
  };

  constructor(private homepageSvc: HomepageService, private toastr: ToastrService, private router: Router) {
    /** Use this in-case this becomes a full blown application with a lot of pages :) */
    // this.router.events.subscribe(event => {
    //   if (environment.production) {
    //     if (event instanceof NavigationEnd) {
    //       ga('set', 'page', event.urlAfterRedirects);
    //       ga('send', 'pageview');

    //       fbq('track', 'PageView');
    //     }
    //   }
    // });
  }


  ngOnInit() {
    console.log("v2");

    smoothscroll.polyfill();

    this.onResize();

    this.cutOffArrows();
  }

  public cutOffArrows() {
    
  }

  public toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  public mailTo() {
    // Incase you wanna make it dynamic.
    let mailToOpen = `mailto:random@test.com`;

    window.open(mailToOpen, '_blank');
  }

  public getAppLink() {
    fbq('track', 'app link via phone number click');

    this.homepageSvc.sendTextMessage(this.contactNumber).subscribe(textMessageRes => {
      if (textMessageRes.status === 200) {
        this.linkSent = true;
      }
    }, (err) => {
      this.toastr.error('Something went wrong!', 'Please try again.');
    })
  };

  public downloadOrFocusInput(from: string) {
    /** Tracking for download */
    if(from === "header") {
      fbq('track', 'header download click');
    } else if (from ==="bottom") {
      fbq('track', 'bottom download click');
    }

    if (!this.mobile && !this.tab) {
      window.scroll({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.phoneNumberEl.nativeElement.focus();
        $("#phone-no").addClass("shake-btn").delay(2000).queue(function (next) {
          $('#phone-no').removeClass("shake-btn");
          next();
        });

        $("#get-link-btn").addClass("shake-btn").delay(2000).queue(function (next) {
          $('#get-link-btn').removeClass("shake-btn");
          next();
        });
      }, 600);


    } else {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.href = 'https://contests-apk.s3.ap-south-1.amazonaws.com/gamesfoo-latest.apk';
      document.body.appendChild(link);
      link.click();
      link.remove();

      const el = document.querySelector('.' + 'how-to');
      const y = el.getBoundingClientRect().top + window.pageYOffset + 90;

      window.scroll({ top: y, behavior: 'smooth' });

      this.howToCarouselLoaded = false;
      
      setTimeout(() => {
        this.howToDesktopCarousel.autoplay = true;
        this.howToDesktopCarousel.autoplayTimeout = 2100;
        this.howToDesktopCarousel.autoplayHoverPause = true;
        this.howToDesktopCarousel.autoplaySpeed = 2000;
        
        this.howToCarouselLoaded = true;

        setTimeout(() => {
          this.howToDesktopCarouselEl.to('1');
        }, 100)
      }, 100);
    }
  }
  
  public validateContactNumber($event: string) {
    var contactNumberRegex = /^\d{10}$/;

    let usualNumbers = ['9', '8', '7', '6', '5']
    if(!usualNumbers.includes($event.charAt(0))) {
      this.enableGetLinkNow = false;

      return;
    }

    if (contactNumberRegex.test($event)) {  
      this.enableGetLinkNow = true;
    } else {  
      this.enableGetLinkNow = false;
    }
  }

  public slideToDiv(elemId: string) {
    $('#menu-btn').click();
    this.showMobileMenu = false;

    const el = document.querySelector('.' + elemId);
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scroll({ top: y, behavior: 'smooth' });
  }

  @HostListener("window:resize", [])
  onResize() {
    var width = window.innerWidth;

    if (width < 768) {
      this.mobile = true;
      this.tab = false;
    } else if (width <= 1024) {
      this.mobile = false;
      this.tab = true;
    } else {
      this.mobile = false;
      this.tab = false;
    }
  }
}
