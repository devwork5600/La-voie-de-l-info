import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface ContactMessageTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactMessageTemplate = ({
  name,
  email,
  subject,
  message,
}: ContactMessageTemplateProps) => {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{`Nouveau message de contact : ${subject}`}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded border border-solid border-[#eaeaea]">
            <Section className="bg-[#0e1b30] px-[20px] py-[24px] text-center">
              <Text
                className="m-0 text-[22px] font-bold text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                La Voie De L&apos;Info
              </Text>
              <Text className="m-0 mt-1 text-[10px] tracking-widest text-[#ffffff99] uppercase">
                Nouveau message de contact
              </Text>
            </Section>

            <Section className="px-[20px]">
              <Heading className="mx-0 my-[30px] border-l-[3px] border-solid border-[#ca3500] p-0 pl-[12px] text-left text-[22px] font-bold text-black">
                {subject}
              </Heading>

              <Text className="text-[14px] leading-[24px] text-black">
                <strong>De :</strong> {name} ({email})
              </Text>

              <Hr className="mx-0 my-[20px] w-full border border-solid border-[#eaeaea]" />

              <Section className="text-[16px] leading-[26px] whitespace-pre-wrap text-black">
                {message}
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="pb-[20px] text-[12px] leading-[20px] text-[#666666]">
                Ce message a été envoyé depuis le formulaire de contact de La
                Voie De L&apos;Info. Vous pouvez répondre directement à cet
                e-mail.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
