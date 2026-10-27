import { Link } from 'react-router-dom';

/** This week's specials, shown on the home page and the menu page. */
export const SPECIALS = [
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    price: '$12.99',
    image: '/greek-salad.svg',
    description: 'The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.',
  },
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    price: '$5.99',
    image: '/bruschetta.svg',
    description: 'Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.',
  },
  {
    id: 'lemon-dessert',
    name: 'Lemon Dessert',
    price: '$5.00',
    image: '/lemon-dessert.svg',
    description: "This comes straight from grandma's recipe book, every last ingredient has been sourced and is as authentic as can be imagined.",
  },
];

/**
 * Grid of special dishes.
 * @param {{ headingLevel?: 'h1' | 'h2', title?: string, showMenuLink?: boolean }} props
 */
function Specials({ headingLevel: Heading = 'h2', title = "This week's specials!", showMenuLink = true }) {
  return (
    <section className="specials container" aria-labelledby="specials-title">
      <div className="specials__header">
        <Heading id="specials-title" className="section-title">{title}</Heading>
        {showMenuLink && <Link to="/menu" className="button button--primary">Online Menu</Link>}
      </div>
      <ul className="specials__grid">
        {SPECIALS.map((dish) => (
          <li key={dish.id}>
            <article className="card" aria-labelledby={`${dish.id}-name`}>
              <img src={dish.image} alt={dish.name} width="400" height="260" loading="lazy" />
              <div className="card__body">
                <div className="card__heading">
                  <h3 id={`${dish.id}-name`}>{dish.name}</h3>
                  <p className="card__price" aria-label={`Price ${dish.price}`}>{dish.price}</p>
                </div>
                <p>{dish.description}</p>
                <Link to="/order-online" className="card__link">
                  Order a delivery<span className="sr-only"> of {dish.name}</span> <span aria-hidden="true">🛵</span>
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Specials;
