export default class RegisterTemplate {
  constructor(private readonly name: string) {}

  getEmail(): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bienvenida</title>
        <style>
          body {
            margin: 0;
            padding: 40px 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #fce4ec;
            color: #ad1457;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            color: #f48fb1;
          }
          h1 {
            font-size: 2rem;
            margin: 0 0 15px;
          }
          p {
            font-size: 1.1rem;
            margin: 0 0 25px;
            max-width: 320px;
            line-height: 1.4;
          }
          .footer {
            font-size: 0.9rem;
            font-style: italic;
            color: #c2185b;
          }
          @media (max-width: 360px) {
            body {
              padding: 30px 15px;
            }
            .icon {
              font-size: 3.2rem;
              margin-bottom: 15px;
            }
            h1 {
              font-size: 1.6rem;
            }
            p {
              font-size: 1rem;
              max-width: 280px;
            }
          }
        </style>
      </head>
      <body>
        <div class="icon" aria-label="Flor">🌸</div>
        <h1>¡Bienvenida, ${this.name}!</h1>
        <p>
          Gracias por unirte a nuestra Biblioteca Rosa. Aquí comienza tu viaje entre libros y sueños, lleno de inspiración y magia.
        </p>
        <div class="footer">¡Disfruta cada página! 💖</div>
      </body>
      </html>
    `;
  }
}
