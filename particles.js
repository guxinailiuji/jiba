// Particles.js configuration
document.addEventListener('DOMContentLoaded', function() {
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 40,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ff9900"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ff9900",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 0.5
            }
          },
          "bubble": {
            "distance": 400,
            "size": 4,
            "duration": 2,
            "opacity": 0.8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }
  
  // Create mining animation particles
  function createMiningParticles() {
    const miningAnimation = document.getElementById('mining-animation');
    if (!miningAnimation) return;
    
    const particlesContainer = miningAnimation.querySelector('.mining-particles');
    if (particlesContainer) {
      // Random number of particles between 5 and 10
      const particleCount = 5 + Math.floor(Math.random() * 5);
      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          // Create particle
          const particle = document.createElement('div');
          particle.classList.add('particle');
          
          // Random size between 2 and 5 pixels
          const size = 2 + Math.random() * 3;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          // Random position around the center coin
          const centerX = particlesContainer.offsetWidth / 2;
          const centerY = particlesContainer.offsetHeight / 2;
          
          // Random angle and distance
          const angle = Math.random() * Math.PI * 2;
          const startDistance = 40 + Math.random() * 20; // Start closer to the coin
          const endDistance = 80 + Math.random() * 40;   // End further from the coin
          
          // Calculate start and end positions
          const startX = centerX + Math.cos(angle) * startDistance;
          const startY = centerY + Math.sin(angle) * startDistance;
          
          const endX = centerX + Math.cos(angle) * endDistance;
          const endY = centerY + Math.sin(angle) * endDistance;
          
          // Set custom properties for the animation
          particle.style.setProperty('--tx', `${endX - startX}px`);
          particle.style.setProperty('--ty', `${endY - startY}px`);
          
          // Position the particle
          particle.style.top = `${startY}px`;
          particle.style.left = `${startX}px`;
          
          // Add to container
          particlesContainer.appendChild(particle);
          
          // Remove particle after animation
          setTimeout(() => {
            if (particle.parentNode === particlesContainer) {
              particlesContainer.removeChild(particle);
            }
          }, 2000);
          
        }, i * 200); // Stagger particle creation
      }
    }
  }
  
  // Start mining animation particles at intervals
  setInterval(createMiningParticles, 2000);
});
