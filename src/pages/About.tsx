import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 bg-leather-smoked/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-leather-espresso/20 via-transparent to-leather-charcoal/20" />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 gold-accent pb-8 tracking-tight">
              About Stichéra
            </h1>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <p className="text-lg leading-relaxed mb-6 text-foreground/90">
                Welcome to <span className="font-semibold text-leather-gold">Stichéra</span>, where artisanal craftsmanship meets timeless sophistication. 
                We curate an exclusive collection of premium leather goods, distinguished home décor, and 
                refined accessories for those who demand excellence in every detail.
              </p>

              <h2 className="font-display text-3xl font-bold mt-12 mb-6 text-leather-cognac">Our Heritage</h2>
              <p className="leading-relaxed mb-6 text-foreground/85">
                Born from a passion for authentic craftsmanship and refined aesthetics, 
                <span className="font-semibold"> Stichéra</span> embodies the marriage of traditional artistry and contemporary elegance. 
                Each piece in our collection is meticulously curated, representing our unwavering commitment to 
                quality, authenticity, and timeless design that transcends fleeting trends.
              </p>

              <h2 className="font-display text-3xl font-bold mt-12 mb-6 text-leather-cognac">Our Philosophy</h2>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start group">
                  <span className="text-leather-gold mr-4 text-xl font-bold">•</span>
                  <div>
                    <strong className="text-leather-cognac text-lg">Uncompromising Quality:</strong>
                    <p className="mt-1 text-foreground/85">Every piece undergoes rigorous selection, ensuring exceptional 
                    craftsmanship, premium materials, and meticulous attention to the finest details.</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <span className="text-leather-gold mr-4 text-xl font-bold">•</span>
                  <div>
                    <strong className="text-leather-cognac text-lg">Timeless Elegance:</strong>
                    <p className="mt-1 text-foreground/85">Our curated collections embody classic sophistication that 
                    transcends trends, offering enduring value and style for generations.</p>
                  </div>
                </li>
                <li className="flex items-start group">
                  <span className="text-leather-gold mr-4 text-xl font-bold">•</span>
                  <div>
                    <strong className="text-leather-cognac text-lg">Exceptional Experience:</strong>
                    <p className="mt-1 text-foreground/85">We cultivate lasting relationships through personalized service, 
                    thoughtful curation, and unwavering dedication to your satisfaction.</p>
                  </div>
                </li>
              </ul>

              <h2 className="font-display text-3xl font-bold mt-12 mb-6 text-leather-cognac">Our Collection</h2>
              <p className="leading-relaxed mb-6 text-foreground/85">
                From <span className="font-semibold">handcrafted leather wallets</span> that marry form and function, 
                to <span className="font-semibold">curated home décor</span> that transforms spaces into sanctuaries—each 
                piece reflects our dedication to authenticity, craftsmanship, and refined taste. We serve those who 
                understand that true luxury lies not in ostentation, but in quiet confidence and enduring quality.
              </p>

              <div className="bg-leather-espresso/20 glass-card p-8 md:p-10 rounded-xl mt-12 border border-leather-tan/20">
                <p className="text-center italic text-lg md:text-xl text-leather-beige leading-relaxed">
                  "True sophistication whispers. It lives in the quality of materials, 
                  the precision of craftsmanship, and the authenticity of experience."
                </p>
                <p className="text-center mt-4 text-sm text-leather-gold font-semibold tracking-wider">
                  — STICHÉRA
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;