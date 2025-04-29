export default function About() {
  return (
    <>
      <style>
        {`
.about_page {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 15vh;
  width: 100%;
}

.about_page h2 {
  font-size: 4vw;
  font-weight: 600;
}

.about_page h2:nth-of-type(2) {
  margin-top: -8vh;
}

.about_page h4 {
  font-size: 1.2vw;
  color: #131313;
  letter-spacing: -0.01vw;
  font-weight: 500;
  width: 50%;
  text-align: center;
  margin-top: -5vh;
}

._about_container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0vw;
  margin-top: 15vh;
  width: 85vw;
  background: #ffffff;
  border-radius: 1vw;
  padding-bottom: 5vh;
}

._about_content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2vh;
  width: 40vw;
  height: 80vh;
  text-align: left;
  padding: 1vh 0;
}

._about_content h3 {
  width: 90%;
  font-size: 1.5vw;
  font-weight: 600;
}

._about_content h5 {
  width: 80%;
  font-size: 1vw;
  line-height: 1.5;
  letter-spacing: -0.01vw;
}

._about_container img {
  width: 40vw;
  height: 80vh;
  object-fit: cover;
  border-radius: 1vw;
  margin-top: 5vh;
}
    `}
      </style>
      <div className="about_page">
        <h2>Nepal’s</h2>
        <br />
        <br />
        <h2>First Guided Puja Store.</h2>
        <h4>
          We offer individual puja items and curated bundles for every
          ritual—tailored to Nepal's diverse castes and traditions. Each bundle
          includes a free, easy-to-follow guide to help you perform ceremonies
          with authenticity and ease. From everyday rituals to grand
          celebrations, we make your spiritual journey complete.
        </h4>
        <div className="_about_container">
          <div className="_about_content">
            <h3> Pujakriti – Keeping Traditions Alive, the Right Way.</h3>
            <h5 className="_desc_text">
              Nepal is a land of deep spirituality, where every community
              celebrates its own unique rituals. From birth to death, from
              festivals to daily prayers—pujas connect us to our roots, to our
              gods, and to each other. At Pujakriti, we honor this diversity by
              offering carefully curated puja bundles, tailored to different
              castes and ceremonies. Each bundle includes all essential items
              along with a step-by-step guide, so you can perform every ritual
              with confidence and devotion. Whether you're near or far, keeping
              your tradition alive is now just a click away.
            </h5>
          </div>
          <img src="/images/bg_img.jpg" alt="pooja" />
        </div>
      </div>
    </>
  );
}
