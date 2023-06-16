const FAQ = () => {
  return (
    <div className=" m-10">
      <h1 className="text-3xl font-bold text-center text-white mb-5">FAQ</h1>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          What is Tokenized Real Estate?
        </summary>
        <div className="collapse-content">
          <p>
            Tokenized real estate is a method of converting the ownership rights
            of real estate properties into digital tokens on a blockchain. This
            allows for fractional ownership and more liquidity in the real
            estate market.
          </p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          What are the benefits of tokenized real estate?
        </summary>
        <div className="collapse-content">
          <p>
            Tokenization can increase liquidity, enable fractional ownership,
            provide greater transparency, speed up transactions, and potentially
            broaden access to real estate investment by lowering the minimum
            investment threshold.
          </p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          How does the platform handle the legal aspects of real estate
          tokenization?
        </summary>
        <div className="collapse-content">
          <p>
            The platform adheres to all local and international laws for every
            property that is tokenized. This includes performing due diligence,
            ensuring proper registration of the tokens as securities, and
            providing full disclosure of information.
          </p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          How can I buy and sell real estate tokens?
        </summary>
        <div className="collapse-content">
          <p>
            Real estate tokens can be bought and sold on our platform. Users can
            browse available properties, purchase tokens that represent a share
            of a property, and sell their tokens on the platform's secondary
            market.
          </p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          Are the tokens tied to specific properties?
        </summary>
        <div className="collapse-content">
          <p>
            Yes, each token is tied to a specific property. When you buy a
            token, you are buying a share of a specific real estate property.
            The details of the property are transparently available on the
            platform.
          </p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200 m-1">
        <summary className="collapse-title text-xl font-medium">
          Can I invest in properties outside of my home country?
        </summary>
        <div className="collapse-content">
          <p>
            Yes, one of the advantages of tokenized real estate is that it can
            make cross-border investments easier. However, certain restrictions
            may apply depending on the laws of the country where the property is
            located and the country of residence of the investor.
          </p>
        </div>
      </details>
    </div>
  );
};

export default FAQ;
