import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import { AppType } from 'next/app';

const cache = createCache({ key: 'css' });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: AppType) => (props) =>
					//убран emotionCache={cache} , вернуть когда начну использовать emotion
          <App {...props} />,
      })

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = constructStyleTagsFromChunks(emotionStyles)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <div dangerouslySetInnerHTML={{ __html: emotionStyleTags }} />
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
