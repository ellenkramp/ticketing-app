import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${Number(ticket.price).toFixed(2)}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>View</Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <section className="gttx-hero">
        <h1>GitTix</h1>
        <p>
          Find your next show, reserve a seat, and check out before the clock
          runs out.
        </p>
        {currentUser ? (
          <div className="gttx-actions">
            <Link className="btn btn-primary" href="/tickets/new">
              Sell tickets
            </Link>
            <Link className="btn btn-outline-secondary" href="/orders">
              My orders
            </Link>
          </div>
        ) : (
          <div className="gttx-actions">
            <Link className="btn btn-primary" href="/auth/signup">
              Get started
            </Link>
            <Link className="btn btn-outline-secondary" href="/auth/signin">
              Sign in
            </Link>
          </div>
        )}
      </section>

      <div className="gttx-panel">
        <h2>Available tickets</h2>
        {tickets.length === 0 ? (
          <div className="gttx-empty">No tickets listed yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
