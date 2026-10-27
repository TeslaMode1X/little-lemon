/** Customer reviews shown on the home page. */
const TESTIMONIALS = [
  { id: 1, name: 'Sara L.', rating: 5, text: 'Best Greek salad in Chicago. Booking a table took less than a minute!' },
  { id: 2, name: 'Tom R.', rating: 4, text: 'Cosy atmosphere and friendly staff. The lemon dessert is a must.' },
  { id: 3, name: 'Priya K.', rating: 5, text: 'We celebrated our anniversary here and the team made it really special.' },
  { id: 4, name: 'Diego M.', rating: 5, text: 'Authentic flavours with a modern twist, exactly as promised.' },
];

function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <h2 id="testimonials-title" className="section-title section-title--center">Testimonials</h2>
        <ul className="testimonials__grid">
          {TESTIMONIALS.map(({ id, name, rating, text }) => (
            <li key={id}>
              <figure className="testimonial">
                <p className="testimonial__rating" aria-label={`Rated ${rating} out of 5`}>
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                </p>
                <blockquote><p>“{text}”</p></blockquote>
                <figcaption>{name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Testimonials;
