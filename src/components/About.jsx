/**
 * "About" section with the restaurant story.
 * @param {{ headingLevel?: 'h1' | 'h2' }} props
 */
function About({ headingLevel: Heading = 'h2' }) {
  return (
    <section className="about container" aria-labelledby="about-title">
      <div className="about__text">
        <Heading id="about-title" className="display-title display-title--dark">Little Lemon</Heading>
        <p className="subtitle subtitle--dark">Chicago</p>
        <p>
          Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved to
          the United States to pursue their shared dream of owning a restaurant.
        </p>
        <p>
          To craft the menu, Mario relies on family recipes and his experience as a chef
          in Italy. Adrian does all the marketing for the restaurant and led the effort to
          expand the menu beyond classic Italian to incorporate additional cuisines from
          the Mediterranean region.
        </p>
      </div>
      <div className="about__images">
        <img src="/chefs.svg" alt="Owners Mario and Adrian in the kitchen" width="400" height="260" loading="lazy" />
        <img src="/restaurant.svg" alt="The Little Lemon kitchen" width="400" height="260" loading="lazy" />
      </div>
    </section>
  );
}

export default About;
