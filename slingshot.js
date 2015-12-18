function Slingshot(hero, state) {

    // states: 0 = not launched, 1 = launch success, 2 = launch fail
    this.state = state
    
    this.display = function() {
      if (hero.state === 'launching') {
        var mouse = createVector(mouseX, mouseY)
        heroLocation = hero.location.copy()
        // var trajectory = heroLocation.sub(mouse)
        // var trajectory2 = heroLocation.add(abs(trajectory.mult(2)))
        stroke(255, 100);  
        strokeWeight(3);
        line(hero.location.x, hero.location.y, mouseX, mouseY);
        // line(trajectory2.x, trajectory2.y, hero.location.x, hero.location.y)
      }
    }
    this.launchHero = function() {
      
    }
}