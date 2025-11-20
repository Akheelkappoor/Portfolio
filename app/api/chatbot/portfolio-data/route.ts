import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Verify API key
    const apiKey = request.headers.get('X-API-Key')
    const validApiKey = process.env.CHATBOT_API_KEY

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing API key" },
        { status: 401 }
      )
    }
    // Fetch all portfolio data in parallel
    const [heroResult, skillsResult, experienceResult, projectsResult] = await Promise.all([
      // Get hero/profile data
      query(`
        SELECT
          name,
          tagline as title,
          description as bio,
          availability_location as location,
          availability_status
        FROM hero_section
        LIMIT 1
      `),

      // Get skills
      query(`
        SELECT si.skill_name, sc.title as category, si.display_order
        FROM skills_items si
        LEFT JOIN skills_categories sc ON si.category_id = sc.id
        ORDER BY si.display_order ASC
        LIMIT 20
      `),

      // Get experience
      query(`
        SELECT title, company, location, period, achievements
        FROM work_experience
        WHERE is_visible = true
        ORDER BY display_order ASC
      `),

      // Get top 5 projects
      query(`
        SELECT
          title,
          meta AS description,
          COALESCE(stack, '[]') AS tech_stack,
          badge,
          image_url
        FROM projects
        ORDER BY created_at DESC
        LIMIT 5
      `)
    ])

    const hero = heroResult.rows[0] || {}
    const skills = skillsResult.rows || []
    const experience = experienceResult.rows || []
    const projects = projectsResult.rows || []

    // Format data for AI chatbot
    const portfolioData = {
      profile: {
        name: hero.name || "Akheel Kappoor",
        title: hero.title || "Business Analyst",
        bio: hero.bio || "",
        location: hero.location || "Dubai, UAE",
        availability: hero.availability_status || "available",
        // Static contact info (not in database)
        email: "akheelkappoor@outlook.com",
        linkedin: "linkedin.com/in/akheel-kappoor",
        projectsDelivered: "100+"
      },

      skills: skills.map((s: any) => ({
        name: s.skill_name,
        category: s.category || "General",
        displayOrder: s.display_order
      })),

      experience: experience.map((e: any) => ({
        title: e.title,
        company: e.company,
        location: e.location || "",
        period: e.period || "",
        achievements: e.achievements || ""
      })),

      projects: projects.map((p: any) => ({
        title: p.title,
        description: p.description,
        techStack: Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack || "",
        badge: p.badge || "",
        imageUrl: p.image_url || ""
      })),

      // Pre-formatted text for AI
      formattedContext: generateFormattedContext(hero, skills, experience, projects)
    }

    return NextResponse.json(portfolioData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })

  } catch (error: any) {
    console.error("[Chatbot API] Failed to fetch portfolio data:", error?.message)
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    )
  }
}

function generateFormattedContext(hero: any, skills: any[], experience: any[], projects: any[]): string {
  const topSkills = skills.slice(0, 10)
  const recentExperience = experience.slice(0, 3)
  const topProjects = projects.slice(0, 5)

  return `
CURRENT PORTFOLIO DATA (Live from Database):

=== PROFILE ===
Name: ${hero.name || "Akheel Kappoor"}
Title: ${hero.title || "Business Analyst"}
Email: akheelkappoor@outlook.com
LinkedIn: linkedin.com/in/akheel-kappoor
Location: ${hero.location || "Dubai, UAE"}
Availability: ${hero.availability_status || "Available"}
Projects Delivered: 100+
Bio: ${hero.bio || "Business Analyst and Automation Specialist"}

=== KEY SKILLS ===
${topSkills.map(s => `- ${s.skill_name} [${s.category || "General"}]`).join('\n')}

=== RECENT EXPERIENCE ===
${recentExperience.map(e => `
Title: ${e.title}
Company: ${e.company}
Period: ${e.period}
Location: ${e.location || ""}
Achievements: ${e.achievements || ""}
`).join('\n---\n')}

=== LATEST PROJECTS ===
${topProjects.map(p => `
Project: ${p.title}
Description: ${p.description}
Tech Stack: ${Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack || ""}
Badge: ${p.badge || ""}
`).join('\n---\n')}

=== CONTACT INFORMATION ===
For inquiries, email: akheelkappoor@outlook.com
LinkedIn: linkedin.com/in/akheel-kappoor
Currently based in: ${hero.location || "Dubai, UAE"}
Availability Status: ${hero.availability_status || "Available"}
Projects Delivered: 100+
`.trim()
}
