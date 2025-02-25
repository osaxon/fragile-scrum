export default function FormatJSON({ data }: { data: unknown }) {
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  )
}
